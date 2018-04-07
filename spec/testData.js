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
                "E6NwApIZTdMx63GYxU3XTHI6OUU2" : true,
                "mscott1" : true
            },
            "timeStamp" : "Wed, 28 Mar 2018 15:16:00 GMT",
            "classDesc" : "Mr. Scott's 4th-grade class"
        }
    },
    "studentHashes": {

    }
}

//module.exports = testData;