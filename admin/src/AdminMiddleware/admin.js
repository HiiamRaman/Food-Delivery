import bcrypt from 'bcrypt';
const hashedPassword   = async()=>{
    const password = "12345678";
    const hashed = await bcrypt.hash(password, 10);
    console.log("hashed password",hashed);
}
hashedPassword()