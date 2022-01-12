export function getStudents() {
    return [
      {
        student_id: 0,
        student_name: "Marco",
        student_surname: "Celeste",
        student_age: 20
      },
      {
        student_id: 1,
        student_name: "Antonio",
        student_surname: "Blu",
        student_age: 20
      },
      {
        student_id: 2,
        student_name: "Umberto",
        student_surname: "Verdi",
        student_age: 20
      },
      {
        student_id: 3,
        student_name: "Francesco",
        student_surname: "Gialli",
        student_age: 20
      },
    ]
  }
  
  export function getSubjects() {
    return [
      {
        subject_id: 0,
        professor: "Antonio",
        subject: "Informatica"
      },
      {
        subject_id: 1,
        professor: "Francesco",
        subject: "Economia"
      },
      {
        subject_id: 2,
        professor: "Alberto",
        subject: "Arte"
      },
      {
        subject_id: 3,
        professor: "Gianluca",
        subject: "Matematica"
      },
    ]
  }
  
  export function getStudents2Subjects() {
    return [
      {
        id: 0,
        student_id: 2,
        subject_id: 1,
      },
      {
        id: 1,
        student_id: 2,
        subject_id: 2,
      },
      {
        id: 2,
        student_id: 0,
        subject_id: 3,
      },
      {
        id: 3,
        student_id: 3,
        subject_id: 0,
      },
    ]
  }