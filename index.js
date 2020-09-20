const http = require("./config/config")();
const PORT = process.env.PORT || 5000

http.listen(PORT, () => console.log(`Listening on ${ PORT }`))
