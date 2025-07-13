/**
 * Class User
 * 
 * 
 */
class User {
  constructor(username, password, first_name, last_name, gender, birthdate) {
    this.username = username;
    // hash of password in db
    this.password = password;

    // Pers data, non public?
    this.first_name = first_name;
    this.last_name = last_name;
    this.gender = gender;
    this.birthdate = birthdate;
  }

  // Getters

  getUserName() {
    return this.username;
  }

  getPassword() {
    return this.password;
  }

  getFirstName() {
    return this.first_name
  }

  getLastName() {
    return this.last_name
  }

  getGender() {
    return this.gender
  }

  getBirthdate() {
    return this.birthdate
  }

  // Setters
  /**
   * @param {string} name Can only contain: letters, numbers and - _ Length 3-39
   */
  setUserName(name) {
    if (typeof (name) != 'string') {
      throw new TypeError(`Invalid type: Expected type string, got a ${typeof (name)}`)
    }
    if (name == "") {
      throw new Error("Invalid value: Empty string")
    }
    if (name.length < 3) {
      throw new Error("Invalid value: username must be at least 3 characters");
    }
    if (name.length > 39) {
      throw new Error("Invalid value: username must be less than 40 characters");
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
      throw new Error("Invalid value: username can only contain letters, numbers, underscore and dash");
    }
    if (!/[a-zA-Z]/.test(name)) {
      throw new Error("Invalid value: username must contain at least one letter")
    }

    this.username = name
  }
  /**
   * @param {string} password Must contain: hier/lover letters, numbers and special characters. Length 12-128
   */
  setPassword(password) {
    if (typeof (password) != 'string') {
      throw new TypeError(`Invalid type: Expected type string, got a ${typeof (password)}`)
    }
    if (password == "") {
      throw new Error("Invalid value: Empty string")
    }
    if (password.length < 12) {
      throw new Error("Invalid value: Min length is 12")
    }
    if (password.length > 50) {
      throw new Error("Invalid value: Max length is 50");
    }

    this.validatePassword(password)

    this.password = password
  }
  /**
   * @param {string} fname Can only contain: letters, spaces, and apostrophes. Length 2-50
   */
  setFirstName(fname) {
    if (typeof (fname) != 'string') {
      throw new TypeError(`Invalid type: Expected type string, got a ${typeof (fname)}`)
    }

    fname = fname.trim();
    if (fname == "") {
      throw new Error("Invalid value: Empty string")
    }
    if (fname.length < 2) {
      throw new Error("Invalid value: Name must be at least 2 characters");
    }
    if (fname.length > 50) {
      throw new Error("Invalid value: Name must be less than 50 characters");
    }
    if (!/^[a-zA-ZА-Яа-яёЁ\s\']+$/.test(fname)) {
      throw new Error("Invalid value: Name can only contain letters, spaces, and apostrophes");
    }
    if (/^[']|[']$/.test(fname)) {
      throw new Error("Invalid value: Name cannot start or end with apostrophe");
    }

    this.first_name = fname
  }
  /**
   * @param {string} lname Can only contain: letters, spaces, and apostrophes. Length 2-50
   */
  setLastName(lname) {
    if (typeof (lname) != 'string') {
      throw new TypeError(`Invalid type: Expected type string, got a ${typeof (lname)}`)
    }
    lname = lname.trim();
    if (lname == "") {
      throw new Error("Invalid value: Empty string")
    }
    if (lname.length < 2) {
      throw new Error("Invalid value: Name must be at least 2 characters");
    }
    if (lname.length > 50) {
      throw new Error("Invalid value: Name must be less than 50 characters");
    }
    if (!/^[a-zA-ZА-Яа-яёЁ\s\']+$/.test(lname)) {
      throw new Error("Invalid value: Name can only contain letters, spaces, and apostrophes");
    }
    if (/^[']|[']$/.test(lname)) {
      throw new Error("Invalid value: Name cannot start or end with apostrophe");
    }
    this.last_name = lname
  }
  /**
   * @param {string} gender must be: male || female || other
   */
  setGender(gender) {
    if (typeof (gender) != 'string') {
      throw new TypeError(`Invalid type: Expected type string, got a ${typeof (gender)}`)
    }
    if (gender == "") {
      throw new Error("Invalid value: Empty string")
    }
    if (gender != "male" && gender != "female" && gender != "other") {
      throw new Error("Invalid value: must be male or female or other")
    }
    this.gender = gender
  }
  /** !!! Use ISO format !!!
   * @param {string|Date} birthdate Date of birth (age must be 6-130 years)
   */
  setBirthdate(birthdate) {
    if (typeof birthdate !== 'string' && !(birthdate instanceof Date)) {
      throw new TypeError(`Invalid type: Expected type string or Date, got a ${typeof birthdate}`);
    }

    let parsedDate;

    if (typeof birthdate === 'string') {
      if (birthdate.trim() === "") {
        throw new Error("Invalid value: Empty string");
      }

      if (!/^\d{4}-\d{2}-\d{2}$/.test(birthdate)) {
        throw new Error("Invalid value: Invalid format, use ISO");
      }
      // if just Date(str), retun be a string and we missing range out
      // because 
      // d = Date("2003-100-1000") just adding out of range time
      // "Sat Jul 12 2025 17:17:03 GMT+0700 (GMT+07:00)"  
      parsedDate = new Date(birthdate);

      if (isNaN(parsedDate.getTime())) {
        throw new Error("Invalid value: Failed to parse string");
      }
    } else {
      parsedDate = birthdate;
    }

    const now = new Date();
    const age = now.getFullYear() - parsedDate.getFullYear();

    // "User" implies a living person. Therefore, there must be an age check.
    // How minus birtdate cant be more that 130 years
    if (age > 130) {
      throw new Error("Invalid value: Age cannot be more than 130 years");
    }

    // 6+ content)))
    if (age < 6) {
      throw new Error("Invalid value: Age cannot be less than 6 years");
    }

    // Only date, not time 
    this.birthdate = parsedDate.toISOString().split('T')[0]
  }

  // help
  validatePassword(password) {
    if (!/[a-z]/.test(password)) {
      throw new Error("Invalid value: Password must contain at least one lowercase letter");
    }

    if (!/[A-Z]/.test(password)) {
      throw new Error("Invalid value: Password must contain at least one uppercase letter");
    }

    if (!/[0-9]/.test(password)) {
      throw new Error("Invalid value: Password must contain at least one number");
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>?/\t\`]/.test(password)) {
      throw new Error("Invalid value: Password must contain at least one special character");
    }
    // How can a user remember the unicode for an emoticon or 
    // something else like this? 
    // Therefore, it is worth validating the character set.
    if (!/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>?/\t\`]+$/.test(password)) {
      throw new Error("Invalid value: Password contains invalid characters");
    }
  }
}

/** Generate a new user
 * @param {string} username 
 * @param {string} password 
 * @param {string} first_name 
 * @param {string} last_name 
 * @param {string} gender 
 * @param {string|Date} birthdate 
 * @returns {User}
 */
function NewUser(username, password, first_name, last_name, gender, birthdate) {
  const user = new User

  try {
    user.setUserName(username)
    user.setPassword(password)
    user.setFirstName(first_name)
    user.setLastName(last_name)
    user.setGender(gender)
    user.setBirthdate(birthdate)
    return user
  } catch (error) {
    throw error
  }
}

module.exports = User, NewUser;