process.env.NODE_ENV = "test";

const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
chai.use(chaiHttp);

const server = require("../server.js");
const app = server(4444);

describe("Checking 404 handling", () => {
  it("should return 404 on /", done => {
    chai
      .request(app)
      .get("/")
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(404);
        done()
      });
  });
});

describe("Healthz Endpoint", () => {
  it("should return healthy system 200", done => {
    chai.request(app)
      .get('/healthz')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200)
        done()
      })
  })
})


describe("Check programs for C lang", () => {
  it("should successfully run the program", done => {
    chai.request(app)
      .post('/run')
      .send({
        "language": "c",
        "code": "#include <stdio.h>\n\nint main() {\n\tprintf(\"Hello\");\n\treturn 0;\n}\n",
        "input": "Hello",
        "eo": "Hello"
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.be.json
        expect(res).to.have.status(200)
        expect(res.body.matches).to.be.true
        expect(res.body.message).to.equal("Program run successfully.")
        expect(res.body.expected).to.equal("Hello")
        expect(res.body.actual).to.equal("Hello")
        expect(res.body.hasError).to.be.false
        expect(res.body.outOfResources).to.be.false
        expect(res.body.errorMessage).to.equal("")
        done()
      })
  })


  it("should throw syntax error", done => {
    chai.request(app)
      .post('/run')
      .send({
        "language": "c",
        "code": "#include <stdio.h>\n\nint main() {\n\tprintf(\"Hello\")\n\treturn 0;\n}\n",
        "input": "Hello",
        "eo": "Hello"
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.be.json
        expect(res).to.have.status(200)
        expect(res.body.message).to.equal("Compilation failed")
        expect(res.body.expected).to.equal("Hello")
        expect(res.body.actual).to.not.equal("Hello")
        expect(res.body.hasError).to.be.true
        expect(res.body.outOfResources).to.be.false
        expect(res.body.errorMessage).to.not.equal("")
        done()
      })
  })

  // it("should timeout as infinite loop there", done => {
  //   chai.request(app)
  //     .post('/run')
  //     .send({
  //       "language": "c",
  //       "code": "#include <stdio.h>\n\nint main() {\n\tint i = 0;\n\twhile(1){i+=i>10?-1:1;}\n\treturn 0;\n}\n",
  //       "input": "Hello",
  //       "eo": "Hello"
  //     })
  //     .end((err, res) => {
  //       expect(err).to.be.null;
  //       expect(res).to.be.json
  //       expect(res).to.have.status(200)
  //       expect(res.body.expected).to.equal("Hello")
  //       expect(res.body.hasError).to.be.false
  //       expect(res.body.outOfResources).to.be.true
  //       done()
  //     })
  // })
})

describe("Check program for C++", () => {
  it("should run c++ program normally.", done => {
    chai.request(app)
      .post('/run')
      .send({
        "language": "cpp",
        "code": "#include <iostream>\nusing namespace std;\nint main() {\n\tcout << \"Hello\";\n\treturn 0;\n}\n",
        "input": "Hello",
        "eo": "Hello"
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.be.json
        expect(res).to.have.status(200)
        expect(res.body.matches).to.be.true
        expect(res.body.message).to.equal("Program run successfully.")
        expect(res.body.expected).to.equal("Hello")
        expect(res.body.actual).to.equal("Hello")
        expect(res.body.hasError).to.be.false
        expect(res.body.outOfResources).to.be.false
        expect(res.body.errorMessage).to.equal("")
        done()
      })
  })

  it("should throw an error.", done => {
    chai.request(app)
      .post('/run')
      .send({
        "language": "cpp",
        "code": "#include <iostream>\nusing namespace std\nint main() {\n\tcout << \"Hello\"\n\treturn 0;\n}\n",
        "input": "Hello",
        "eo": "Hello"
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.be.json
        expect(res).to.have.status(200)
        expect(res.body.message).to.equal("Compilation failed")
        expect(res.body.expected).to.equal("Hello")
        // expect(res.body.actual).to.not.equal("Hello")
        expect(res.body.hasError).to.be.true
        expect(res.body.outOfResources).to.be.false
        expect(res.body.errorMessage).to.not.equal("")
        done()
    })
  })  

  // it("should timeout due to infinite loop", done => {
  //   chai.request(app)
  //     .post('/run')
  //     .send({
  //       "language": "cpp",
  //       "code": "#include <stdio.h>\n\nint main() {\n\tint i = 0;\n\twhile(1){i+=i>10?-1:1;}\n\treturn 0;\n}\n",
  //       "input": "Hello",
  //       "eo": "Hello"
  //     })
  //     .end((err, res) => {
  //       expect(err).to.be.null;
  //       expect(res).to.be.json
  //       expect(res).to.have.status(200)
  //       expect(res.body.expected).to.equal("Hello")
  //       expect(res.body.hasError).to.be.false
  //       expect(res.body.outOfResources).to.be.true
  //       done()
  //     })
  // })
})

describe("Check program for Java", () => {
  it("should run program successfully.", done => {
    chai.request(app)
      .post('/run')
      .send({
        "language": "java",
        "code": "class Program {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.print(\"Hello\");\n\t}\n}",
        "input": "anything",
        "eo": "Hello"
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.be.json
        expect(res).to.have.status(200)
        expect(res.body.expected).to.equal(res.body.actual)
        expect(res.body.matches).to.be.true
        expect(res.body.message).to.equal("Program run successfully.")
        expect(res.body.expected).to.equal("Hello")
        expect(res.body.actual).to.equal("Hello")
        expect(res.body.hasError).to.be.false
        expect(res.body.outOfResources).to.be.false
        expect(res.body.errorMessage).to.equal("")
        done()
      })
  })

  it("should throw an error.", done => {
    chai.request(app)
      .post('/run')
      .send({
        "language": "java",
        "code": "class Program {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.print(\"Hello\")\n\t}\n}",
        "input": "anything",
        "eo": "Hello"
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.be.json
        expect(res).to.have.status(200)
        expect(res.body.message).to.equal("Compilation failed")
        expect(res.body.expected).to.equal("Hello")
        // expect(res.body.actual).to.not.equal("Hello")
        expect(res.body.hasError).to.be.true
        expect(res.body.outOfResources).to.be.false
        expect(res.body.errorMessage).to.not.equal("")
        done()
    })
  })
})

describe("Check program for Python", () => {
  it("should run program successfully.", done => {
    chai.request(app)
      .post('/run')
      .send({
        "language": "python",
        "code": "print(\"Hello\", end='')",
        "input": "anything",
        "eo": "Hello"
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.be.json
        expect(res).to.have.status(200)
        expect(res.body.matches).to.be.true
        expect(res.body.message).to.equal("Program run successfully.")
        expect(res.body.expected).to.equal("Hello")
        expect(res.body.actual).to.equal("Hello")
        expect(res.body.hasError).to.be.false
        expect(res.body.outOfResources).to.be.false
        expect(res.body.errorMessage).to.equal("")
        done()
      })
  })

  it("should throw an error.", done => {
    chai.request(app)
      .post('/run')
      .send({
        "language": "python",
        "code": "print(\"Hello\"  end='')",
        "input": "anything",
        "eo": "Hello"
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.be.json
        expect(res).to.have.status(200)
        expect(res.body.message).to.equal("Program has an error.")
        expect(res.body.expected).to.equal("Hello")
        // expect(res.body.actual).to.not.equal("Hello")
        expect(res.body.hasError).to.be.true
        expect(res.body.outOfResources).to.be.false
        expect(res.body.errorMessage).to.not.equal("")
        done()
    })
  })
})

describe("Check program for PHP", () => {
  it("should run program successfully.", done => {
    chai.request(app)
      .post('/run')
      .send({
        "language": "php",
        "code": "<?php print(\"Hello\");",
        "input": "anything",
        "eo": "Hello"
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.be.json
        expect(res).to.have.status(200)
        expect(res.body.matches).to.be.true
        expect(res.body.message).to.equal("Program run successfully.")
        expect(res.body.expected).to.equal("Hello")
        expect(res.body.actual).to.equal("Hello")
        expect(res.body.hasError).to.be.false
        expect(res.body.outOfResources).to.be.false
        expect(res.body.errorMessage).to.equal("")
        done()
      })
  })

  it("should throw an error.", done => {
    chai.request(app)
      .post('/run')
      .send({
        "language": "php",
        "code": "<?php print(\"Hello\")",
        "input": "anything",
        "eo": "Hello"
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.be.json
        expect(res).to.have.status(200)
        expect(res.body.message).to.equal("Program has an error.")
        expect(res.body.expected).to.equal("Hello")
        // expect(res.body.actual).to.not.equal("Hello")
        expect(res.body.hasError).to.be.true
        expect(res.body.outOfResources).to.be.false
        expect(res.body.errorMessage).to.not.equal("")
        done()
    })
  })
})

describe("Check program for Go Lang", () => {
  it("should run program successfully.", done => {
    chai.request(app)
      .post('/run')
      .send({
        "language": "go",
        "code": "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tfmt.Print(\"Hello\")\n}\n",
        "input": "anything",
        "eo": "Hello"
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.be.json
        expect(res).to.have.status(200)
        expect(res.body.matches).to.be.true
        expect(res.body.message).to.equal("Program run successfully.")
        expect(res.body.expected).to.equal("Hello")
        expect(res.body.actual).to.equal("Hello")
        expect(res.body.hasError).to.be.false
        expect(res.body.outOfResources).to.be.false
        expect(res.body.errorMessage).to.equal("")
        done()
      })
  })

  it("should throw an error.", done => {
    chai.request(app)
      .post('/run')
      .send({
        "language": "go",
        "code": "package main\n\nimport \"fmt\"\n\nmain() {\n\tfmt.Print(\"Hello\")\n}\n",
        "input": "anything",
        "eo": "Hello"
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.be.json
        expect(res).to.have.status(200)
        expect(res.body.message).to.equal("Program has an error.")
        expect(res.body.expected).to.equal("Hello")
        // expect(res.body.actual).to.not.equal("Hello")
        expect(res.body.hasError).to.be.true
        expect(res.body.outOfResources).to.be.false
        expect(res.body.errorMessage).to.not.equal("")
        done()
    })
  })
})

describe("Check program for Javascript", () => {
  it("should run program successfully.", done => {
    chai.request(app)
      .post('/run')
      .send({
        "language": "javascript",
        "code": "console.log(\"Hello\");",
        "input": "anything",
        "eo": "Hello\n"
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.be.json
        expect(res).to.have.status(200)
        expect(res.body.matches).to.be.true
        expect(res.body.message).to.equal("Program run successfully.")
        expect(res.body.expected).to.equal("Hello\n")
        expect(res.body.actual).to.equal("Hello\n")
        expect(res.body.hasError).to.be.false
        expect(res.body.outOfResources).to.be.false
        expect(res.body.errorMessage).to.equal("")
        done()
      })
  })

  it("should throw an error.", done => {
    chai.request(app)
      .post('/run')
      .send({
        "language": "javascript",
        "code": "consoel.log(\"Hello\");",
        "input": "anything",
        "eo": "Hello"
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.be.json
        expect(res).to.have.status(200)
        expect(res.body.message).to.equal("Program has an error.")
        expect(res.body.expected).to.equal("Hello")
        // expect(res.body.actual).to.not.equal("Hello")
        expect(res.body.hasError).to.be.true
        expect(res.body.outOfResources).to.be.false
        expect(res.body.errorMessage).to.not.equal("")
        done()
    })
  })
})

