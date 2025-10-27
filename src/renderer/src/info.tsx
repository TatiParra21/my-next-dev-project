
import { OptionOf } from "./types";
 const capitalizeFirstLetter =(value: string):string=>{
    return value.charAt(0).toUpperCase() + value.slice(1)
  }

 const popularLanguages :string[] =[
  
  "JavaScript","Python","Java","TypeScript","C#","C++","C","Go","Rust","Ruby",
  "PHP","Kotlin","Swift","Dart","Scala","Perl","Haskell","Lua","Elixir","Erlang","Objective-C",
  "R","Visual Basic","Assembly","Groovy","Shell","Bash","PowerShell","F#","Crystal","V","Nim",
  "Zig","Julia","COBOL","Fortran","Ada","OCaml","Scheme","Common Lisp","Prolog","Delphi","Hack",
  "VBScript","Tcl","SAS","Solidity","Reason","Nix","Smalltalk","SQL"
]

const frameworks :string[] =[
  "Angular","Vue.js","Next.js","Nuxt.js","SvelteKit","Ember.js","NestJS","Express.js","Koa","Hapi","Django","Flask",
  "FastAPI","Rails","Spring Boot","Laravel","ASP.NET Core","Meteor","Phoenix","Symfony","CodeIgniter","Struts","Play Framework",
  "Quarkus","Micronaut","Remix","Blitz.js","RedwoodJS","Electron","Capacitor","Ionic","Expo","Gatsby","JHipster","LoopBack","FeathersJS",
  "AdonisJS","CakePHP","TurboGears", "Tailwind CSS"
]


  const libraries :string[] = [
  "React", "jQuery", "Lodash", "Axios", "Zod", "React Router", "Redux", "Recoil",
  "Immer", "D3.js", "Chart.js", "Three.js", "Moment.js", "Day.js", "classnames",
  "uuid", "date-fns", "Yup", "Framer Motion", "TanStack Query",
  "NumPy", "Pandas", "Matplotlib", "Seaborn", "Requests", "Flask-RESTful",
  "SQLAlchemy", "BeautifulSoup", "OpenCV", "PyTorch", "TensorFlow", "Pydantic",
  "FastAPI-utils", "Plotly", "Boto3",
  "Gson", "Apache Commons", "Jackson", "JUnit", "SLF4J", "Logback", "Retrofit",
  "OkHttp", "RxJava", "Lombok", "Zustand",
  "Boost"
];
export type LanguagesType = typeof popularLanguages[number]
export type FrameWorkType = typeof frameworks[number]
export type LibrariesType = typeof libraries[number]
export type AllCategoriesType = LanguagesType | FrameWorkType | LibrariesType
const turnIntoOptionType =(arr:string[]):OptionOf<AllCategoriesType>[]=>{
return arr.map(item =>{
  return{ value:item.toLowerCase() as Lowercase<AllCategoriesType>, label:capitalizeFirstLetter(item) as Capitalize<AllCategoriesType>}
})
}
import { CategoriesTypeObjArr } from "./types";
export const categories :CategoriesTypeObjArr ={
  languages: turnIntoOptionType(popularLanguages),
  frameworks: turnIntoOptionType(frameworks),
  libraries: turnIntoOptionType(libraries)
}