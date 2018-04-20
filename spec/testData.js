var testData = {
    "users" : {
        "E6NwApIZTdMx63GYxU3XTHI6OUU2" : {
        "email" : "mscott6@wisc.edu",
        "firstName" : "Michael",
        "surName" : "Scott",
        "timeStamp" : "Tue, 27 Mar 2018 15:16:00 GMT",
        "type" : "student",
        "student" : {
            "classId" : undefined,
            "gradeLevel" : 3
            }
        },
        "afisk" : {
        "email" : "the_real_fisk@wisc.edu",
        "firstName" : "Austin",
        "surName" : "Fisk",
        "timeStamp" : "Tue, 27 Mar 2018 15:16:00 GMT",
        "type" : "student",
        "student" : {
            "classId" : "12345",
            "gradeLevel" : 4
            }
        },
        "mscott" : {
        "email" : "mscott4@wisc.edu",
        "firstName" : "Michael",
        "surName" : "Scott",
        "timeStamp" : "Tue, 27 Mar 2018 15:16:00 GMT",
        "type" : "student",
        "student" : {
            "classId" : "34412",
            "gradeLevel" : 5
            }
        },
        "mscott1" : {
        "email" : "mscott5@wisc.edu",
        "firstName" : "Michael",
        "surName" : "Scott",
        "timeStamp" : "Tue, 27 Mar 2018 15:16:00 GMT",
        "type" : "student",
        "student" : {
            "classId" : "12312",
            "gradeLevel" : 2
            }   
        },
        "mscott2" : {
            "email" : "mscott5@wisc.edu",
            "firstName" : "Michael",
            "surName" : "Scott",
            "timeStamp" : "Tue, 27 Mar 2018 15:16:00 GMT",
            "type" : "teacher",
            "teacher" : {
                "classList" : {
                    "1234" : true
                },
                "teacherDesc" : "I am."
                }   
            }
    },
    "classes": {
        "1234" : {
            "teacherId": "mscott2",
            "studentList" : {
                "E6NwApIZTdMx63GYxU3XTHI6OUU2": "E6NwApIZTdMx63GYxU3XTHI6OUU2",
                "mscott1": "mscott1"
            },
            "timeStamp" : "Wed, 28 Mar 2018 15:16:00 GMT",
            "classDesc" : "Mr. Scott's 4th-grade class"
        }
    },
    "studentHashes": {

    },
    "notifications":{
        "afisk" : {
            "5454" :{
                "problemURL" : "5678",
                "creationDate" : "Tue, 27 Mar 2018 15:16:00 GMT",
                "dueDate" : "Tue, 20 Mar 2019 15:16:00 GMT",
                "completedDate" : "Tue, 27 Mar 2018 16:16:00 GMT",
                "message" : "do this or fail"
            }

        }
    },
    "problemInstances" : {
        "afisk" : {
            "5678" : {
                "problemType" : "MathFact",
                "correct" : true,
                "timeStamp" : "Tue, 27 Mar 2018 15:16:00 GMT",
                "MathFact" : {
                    "num1" : 2,
                    "num2" : 3,
                    "operation" : "addition"
                }
            }
        }
    }
}

//module.exports = testData;