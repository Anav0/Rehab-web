import { Patient, Sex } from "../models/patient";

let firstNameM = ['Jacek', 'Tomek', 'Andrzej','Wiesław','Żytomir','Chlebosław','Lesław','Igor','Leszek']
let firstNameF = ['Ewa', 'Janina', 'Dorota','Wiesława','Żytomira','Chlebosława','Lesława','Hermione','Leszeksława']
let lastName = ['Kowalski','Nowak','Żyto','Pszenica','Owies','Chmiel','Kukurydza','Oregano','Bazylia']
let patients: Patient[] = []

for (let i = 0; i < 2000; i++) {
  let name = ''
  let sex = i % 4 ? Sex.FEMALE : Sex.MALE
  if(sex==Sex.MALE)
    name = firstNameM[Math.floor(Math.random() * firstNameM.length)]
  else
    name = firstNameF[Math.floor(Math.random() * firstNameM.length)]

  name+=` ${lastName[Math.floor(Math.random() * firstNameM.length)]}`
  patients.push(new Patient(name,sex))
}

export default patients;
