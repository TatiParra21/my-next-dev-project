function verifyGoogleUser(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Missing token" });

  const token = authHeader.split(" ")[1];
  oAuth2Client.verifyIdToken({ idToken: token, audience: CLIENT_ID })
    .then(ticket => {
      req.user = ticket.getPayload();
      next();
    })
    .catch(() => res.status(401).json({ error: "Invalid token" }));
}
