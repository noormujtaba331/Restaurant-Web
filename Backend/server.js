const app= require("./src/app");
const dotenv= require("dotenv");
dotenv.config();

app.listen(process.env.Port,()=>{
    console.log(`Server is running on port ${process.env.Port}`);
})