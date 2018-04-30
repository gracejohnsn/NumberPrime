var testData = {
    "users": {
        "E6NwApIZTdMx63GYxU3XTHI6OUU2": {
            "email": "mscott6@wisc.edu",
            "firstName": "Michael",
            "surName": "Scott",
            "timeStamp": "Tue, 27 Mar 2018 15:16:00 GMT",
            "type": "student",
            "student": {
                "classId": undefined,
                "gradeLevel": 3
            }
        },
        "afisk": {
            "email": "the_real_fisk@wisc.edu",
            "firstName": "Austin",
            "surName": "Fisk",
            "timeStamp": "Tue, 27 Mar 2018 15:16:00 GMT",
            "type": "student",
            "student": {
                "classId": "12345",
                "gradeLevel": 4
            }
        },
        "mscott": {
            "email": "mscott4@wisc.edu",
            "firstName": "Michael",
            "surName": "Scott",
            "timeStamp": "Tue, 27 Mar 2018 15:16:00 GMT",
            "type": "student",
            "student": {
                "classId": "34412",
                "gradeLevel": 5
            }
        },
        "mscott1": {
            "email": "mscott5@wisc.edu",
            "firstName": "Michael",
            "surName": "Scott",
            "timeStamp": "Tue, 27 Mar 2018 15:16:00 GMT",
            "type": "student",
            "student": {
                "classId": "12312",
                "gradeLevel": 2
            }
        },
        "mscott2": {
            "email": "mscott5@wisc.edu",
            "firstName": "Michael",
            "surName": "Scott",
            "timeStamp": "Tue, 27 Mar 2018 15:16:00 GMT",
            "type": "teacher",
            "teacher": {
                "classList": {
                    "1234": "1234"
                },
                "teacherDesc": "I am."
            }
        }
    },
    "classes": {
        "1234": {
            "teacherId": "mscott2",
            "studentList": {
                "E6NwApIZTdMx63GYxU3XTHI6OUU2": "E6NwApIZTdMx63GYxU3XTHI6OUU2",
                "mscott1": "mscott1"
            },
            "timeStamp": "Wed, 28 Mar 2018 15:16:00 GMT",
            "classDesc": "Mr. Scott's 4th-grade class"
        },
        "3141": {
            "classDesc": "Mr. Scott's 3rd-grade math class",
            "studentList": {
                "E6NwApIZTdMx63GYxU3XTHI6OUU2": "E6NwApIZTdMx63GYxU3XTHI6OUU2",
                "eEPJVil2tIXppLtC0Ji2GBND9T83": "eEPJVil2tIXppLtC0Ji2GBND9T83",
                "gKUc6k3F7igiZu2TwjOV2Yfyp2g1": "gKUc6k3F7igiZu2TwjOV2Yfyp2g1"
            },
            "teacherId": "ECTQhADmERc5DveBxop4IgerPWD3",
            "timeStamp": "Wed, 29 Mar 2018 15:16:00 GMT"
        },
        "12345": {
            "classDesc": "Mr. Scott's 4th-grade class",
            "studentList": {
                "TrttBaeGAzNzDx4kpCD8MahLhOw2": "TrttBaeGAzNzDx4kpCD8MahLhOw2"
            },
            "teacherId": "ECTQhADmERc5DveBxop4IgerPWD3",
            "timeStamp": "Wed, 28 Mar 2018 15:16:00 GMT"
        },
        "-LAzU54M4KZms1RmpLG0": {
            "classDesc": "Test Class",
            "studentList": "",
            "teacherId": "ECTQhADmERc5DveBxop4IgerPWD3",
            "timeStamp": "Thu, 26 Apr 2018 01:06:04 GMT"
        },
        "-LAzYkh-Wnv1uSjAUfyY": {
            "classDesc": "Austin is super dooper smart math work",
            "studentList": {
                "gKUc6k3F7igiZu2TwjOV2Yfyp2g1": "gKUc6k3F7igiZu2TwjOV2Yfyp2g1"
            },
            "teacherId": "ECTQhADmERc5DveBxop4IgerPWD3",
            "timeStamp": "Thu, 26 Apr 2018 01:26:27 GMT"
        },
        "-LBDc5WloP8An-oSPU7z": {
            "classDesc": "Dono TestClass",
            "studentList": {
                "68NoXT9gSHWQxKh56qGdXepto303": "68NoXT9gSHWQxKh56qGdXepto303",
                "sUWp9aUIVHbWDxJl5opL4AmvvaD2": "sUWp9aUIVHbWDxJl5opL4AmvvaD2"
            },
            "teacherId": "2Zp9cSl2J2ekO13xfYMGppHEICv2",
            "timeStamp": "Sat, 28 Apr 2018 23:39:40 GMT"
        },
        "-LBHPpFKJFFK2Mp4I96l": {
            "classDesc": "Potatoe",
            "studentList": "",
            "teacherId": "gKUc6k3F7igiZu2TwjOV2Yfyp2g1",
            "timeStamp": "Sun, 29 Apr 2018 17:20:14 GMT"
        },
        "-LBHPrPMjeXivEmjAk4U": {
            "classDesc": "Potat",
            "studentList": "",
            "teacherId": "gKUc6k3F7igiZu2TwjOV2Yfyp2g1",
            "timeStamp": "Sun, 29 Apr 2018 17:20:23 GMT"
        }
    },
    "studentHashes": {

    },
    "notifications": {
        "afisk": {
            "5454": {
                "problemURL": "5678",
                "creationDate": "Tue, 27 Mar 2018 15:16:00 GMT",
                "dueDate": "Tue, 20 Mar 2019 15:16:00 GMT",
                "completedDate": "Tue, 27 Mar 2018 16:16:00 GMT",
                "message": "do this or fail"
            }

        },
        "E6NwApIZTdMx63GYxU3XTHI6OUU2": {
            "5454": {
                "problemURL": "5678",
                "creationDate": "Tue, 27 Mar 2018 15:16:00 GMT",
                "dueDate": "Tue, 20 Mar 2019 15:16:00 GMT",
                "completedDate": "Tue, 27 Mar 2018 16:16:00 GMT",
                "message": "do this or fail"
            }

        },

    },

    "problemInstances" : {
        "E6NwApIZTdMx63GYxU3XTHI6OUU2" : {
            "-LAxXpFCzosLiOUSMrVQ" : {
              "problemType" : "Multiplication",
              "problemURL" : "#!/MathFacts/2/100/1/1/5/5/1",
              "timeStamp" : "Wed, 25 Apr 2018 16:03:09 GMT",
              "totalCorrect" : 9,
              "totalProblems" : 10
            },
            "-LB1CwuoRp5MIys8wjo8" : {
              "problemType" : "Addition",
              "problemURL" : "#!/MathFacts/0/9/1/1/9/1/1",
              "timeStamp" : "Thu, 26 Apr 2018 13:50:01 GMT",
              "totalCorrect" : 10,
              "totalProblems" : 10
            },
            "-LBBelcou94o-e5HvmP9" : {
              "problemNums" : [ "5+4", "3+8", "5+8", "2+6", "8+6", "6+7", "8+7", "4+3", "3+2", "6+3" ],
              "problemType" : "Addition",
              "problemURL" : "#!/MathFacts/0/9/1/1/9/1/1",
              "solutions" : [ 9, 11, 13, 8, 14, 13, 15, 7, 5, 9 ],
              "timeStamp" : "Sat, 28 Apr 2018 14:32:10 GMT",
              "totalCorrect" : 10,
              "totalProblems" : 10,
              "userAnswers" : [ 9, 11, 13, 8, 14, 13, 15, 7, 5, 9 ]
            },
            "-LBGwRkQnqUDlsFu7uJD" : {
              "problemNums" : [ "4+2", "3+1", "2+5", "8+6", "1+2", "5+1", "7+4", "6+9", "8+1", "6+2" ],
              "problemType" : "Addition",
              "problemURL" : "#!/MathFacts/0/9/1/1/9/1/1",
              "solutions" : [ 6, 4, 7, 14, 3, 6, 11, 15, 9, 8 ],
              "timeStamp" : "Sun, 29 Apr 2018 15:07:29 GMT",
              "totalCorrect" : 7,
              "totalProblems" : 10,
              "userAnswers" : [ 6, 4, 7, 14, 3, 6, 11, 0, 0, 0 ]
            },
            "-LBGzBd6B7pLdsrPNZmA" : {
              "problemNums" : [ "3*6", "3*6", "3*5", "3*7", "3*2", "4*4", "3*7", "4*9", "4*8", "3*3" ],
              "problemType" : "Multiplication",
              "problemURL" : "#!/MathFacts/2/4/3/1/10/1/1",
              "solutions" : [ 18, 18, 15, 21, 6, 16, 21, 36, 32, 9 ],
              "timeStamp" : "Sun, 29 Apr 2018 15:19:29 GMT",
              "totalCorrect" : 10,
              "totalProblems" : 10,
              "userAnswers" : [ 18, 18, 15, 21, 6, 16, 21, 36, 32, 9 ]
            }
          }
    }
}

//module.exports = testData;