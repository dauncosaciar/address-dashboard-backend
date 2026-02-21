import server from "./server";

const port = process.env.PORT || 3333;

server.listen(port, () => console.log(`API REST running on port ${port}`));
