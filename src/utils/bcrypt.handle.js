const { hash, compare } = require("bcryptjs") 
const encrypt = async (pass) => {
    const passwordHash = await hash(pass,8);
    return passwordHash;
}

const verified = async (pass,passHash) => {
    console.log(pass,passHash)
    const isCorrect = await compare(pass,passHash);
    return isCorrect;
}

module.exports = {
    encrypt,
    verified
}