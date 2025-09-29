"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const db_1 = require("./db");
exports.router = express_1.default.Router();
const errorResponses = {
    '23503': { message: 'Project messes with table constraint' },
    '23505': { message: 'Project already exists' },
    '23502': { message: 'NOt null violation' },
    '42P01': { message: 'Table does not exist.' }
};
exports.router.get("/project-ideas", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.pool.query(`SELECT * FROM project_ideas;`);
        if (!Array.isArray(result.rows) || result.rows.length === 0) {
            res.status(200).json({ message: "Nothing was Found", found: false });
        }
        else if (Array.isArray(result.rows) && result.rows.length >= 1) {
            res.status(200).json({ results: result.rows, message: "Project WAS FOUND" });
        }
    }
    catch (err) {
        //basically if there is an error code and that error code is in errorResponses object it will send this back
        if (err.code && errorResponses[err.code]) {
            res.status(200).json({ message: 'unique constraint is violation.Application is trying to insert a duplicate value into a column that has a unique constraint.', });
        }
        else {
            console.error("SOMETHING WORNG", err.code);
            res.status(404).json({ message: "UNKNOWN ERROR", err: err });
        }
    }
}));
exports.router.post("/write-new-project", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body[0];
    try {
        if (!body)
            throw new Error('there was a problem with the body');
        const query = `INSERT INTO project_ideas (name,description,categories,completed) VALUES ($1,$2,$3,$4) RETURNING *;`;
        const { name, description, categories, completed } = body;
        const values = [name, description, categories, completed];
        const result = yield db_1.pool.query(query, values);
        if (result.rows.length === 0) {
            throw new Error("results too short");
        }
        else {
            res.status(201).json({ result: result.rows, message: "Project was Posted", success: true });
        }
    }
    catch (err) {
        //basically if there is an error code and that error code is in errorResponses object it will send this back
        if (err.code && errorResponses[err.code]) {
            res.status(200).json({ message: errorResponses[err.code].message, success: false });
        }
        else {
            console.error("SOMETHING WORNG", err.code);
            res.status(404).json({ message: "UNKNOWN ERROR", success: false, code: err.code, place: "write-new-project" });
        }
    }
}));
exports.router.patch("/project-ideas/:id/edit", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const updatedData = req.body;
    //const updatedData = body.updatedData
    const allowedFields = ["name", "description", "categories", "completed"];
    const fieldsChosen = allowedFields.filter(field => Object.keys(updatedData).includes(field));
    const clauses = fieldsChosen.map((field, index) => `${field} = $${index + 1}`).join(", ");
    const values = fieldsChosen.map(field => {
        return updatedData[field];
    });
    let message;
    try {
        const query = `UPDATE project_ideas SET ${clauses} WHERE id = ${id}`;
        // console.log(body,"body")
        yield db_1.pool.query(query, values);
        res.status(200).json({ message: 'Project updated successfully', success: true });
    }
    catch (err) {
        //basically if there is an error code and that error code is in errorResponses object it will send this back
        if (err.code && errorResponses[err.code]) {
            res.status(200).json({ message: errorResponses[err.code].message, success: false });
        }
        else {
            //console.error("SOMETHING WORNG",err.code)
            res.status(404).json({ message: "UNKNOWN ERROR", success: false, place: "write-new-project" });
        }
    }
}));
exports.router.delete("/project-ideas/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        yield db_1.pool.query(`DELETE FROM project_ideas WHERE id =$1`, [id]);
        res.status(200).json({ message: 'Project deleted successfully', success: true });
    }
    catch (err) {
        //basically if there is an error code and that error code is in errorResponses object it will send this back
        if (err.code && errorResponses[err.code]) {
            res.status(200).json({ message: errorResponses[err.code].message });
        }
        else {
            console.error("failed to delete", err.code);
            res.status(404).json({ message: "UNKNOWN ERROR", err: err, place: "write-new-project" });
        }
    }
}));
exports.router.get("/project-ideas:cat", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.pool.query(`SELECT * FROM project_ideas;`);
        if (!Array.isArray(result.rows) || result.rows.length === 0) {
            res.status(200).json({ message: "Nothing was Found", found: false });
        }
        else if (Array.isArray(result.rows) && result.rows.length >= 1) {
            res.status(200).json({ results: result.rows, message: "Project WAS FOUND" });
        }
    }
    catch (err) {
        //basically if there is an error code and that error code is in errorResponses object it will send this back
        if (err.code && errorResponses[err.code]) {
            res.status(200).json({ message: 'unique constraint is violation.Application is trying to insert a duplicate value into a column that has a unique constraint.', });
        }
        else {
            console.error("SOMETHING WORNG", err.code);
            res.status(404).json({ message: "UNKNOWN ERROR", err: err });
        }
    }
}));
