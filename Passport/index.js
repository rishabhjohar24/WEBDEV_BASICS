const bcrypt = require('bcrypt');

const hashPassword = async (pw) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(pw, salt);
    console.log(salt);
    console.log(hash);
}

const login = async (pw, hashedPassword) => {
    const result = await bcrypt.compare(pw, hashedPassword);
    if(result) {
        console.log("In");
    }
    else{
        console.log("FuckOff");
    }
}

// hashPassword('monkey');
login('monkey1', '$2b$10$8DSjkl3AtKqou0ENCx7gauAF3bI0OsvbhVTN8ItYP0.nDRc8yqkju');