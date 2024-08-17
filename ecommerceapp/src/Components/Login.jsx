import React, { useState } from "react";
import "./Style.css";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import axios from "axios";

const Login = () => {
  const [login, setLogin] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState({});

  const handleChange = (event) => {
    console.log(event.target.value);
    setLogin({ ...login, [event.target.name]: event.target.value });
  };
  console.log(login);

  const Validate = () => {
    const errormessage = {};
    if (!login.email) {
      errormessage.email = "Enter email";
    }
    if (!login.password) {
      errormessage.password = "Enter password";
    }
    setError(errormessage)
    return Object.keys(errormessage).length===0
  };

  const handleSubmit = async () => {
    if (!Validate()) {
      console.log("error")
      return
    }

    axios
      .post("http://localhost:8080/auth/login", login)
      .then((response) => {
        console.log(response);
        localStorage.setItem("loginId",response.data.loginId)
        localStorage.setItem("role",response.data.role)
      })
      .catch((error) => {
        console.log(error);
      });
      
  };

  return (
    <div className="signupbg">
      <div className="loginformdiv">
        <div className="forminnerdiv">
          <Form className="text-center">
            <div className="text-center text-white mb-4 signuphead">Login</div>

            <Row className="mb-3 justify-content-center">
              <Form.Group
                as={Col}
                sm={5}
                controlId="formGridEmail"
                className="logingridone"
              >
                <Form.Label className="labelstyle">{error.email}</Form.Label>
              {/* <span>{error.email}</span> */}

                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  name="email"
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group as={Col} sm={5} controlId="formGridPassword">
                <Form.Label className="labelstyle">{error.password}</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  name="password"
                  onChange={handleChange}
                />
              </Form.Group>
            </Row>
            <Button
              variant="warning"
              size="sm"
              className="btnstyle mt-3"
              onClick={handleSubmit}
            >
              Login
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
