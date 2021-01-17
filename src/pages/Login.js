import React,{useState,useContext} from 'react';
import {Form,Button} from "semantic-ui-react";
import gql from "graphql-tag";
import {useMutation} from "@apollo/client";
import useForm from "../util/hooks";
import { AuthContext} from '../context/auth'
const Login = (props) => {
    const context= useContext(AuthContext)
    const [errors,setErrors] = useState({})

    const {onChange,onSubmit,values} = useForm(authenticateUser,{
        username:'',
        password:'',
    })

    const [authUser, {loading}] = useMutation(LOGIN_USER,{
            update(proxy, {data:{login:userData}}){
            context.login(userData)
            props.history.push("/")
        },
        onError(err){

            setErrors(err.graphQLErrors[0].extensions.exception.errors)
        },
        variables:values
    })

    function authenticateUser(){
        authUser()
            .then(res=> null)
            .catch(err=>null)
    }
    return (
        <div className="form-container">
            <Form onSubmit={onSubmit} noValidate className={loading?"loading":""}>
                <h1>Login</h1>
                <Form.Input
                    label="Username"
                    palceholder="Username.."
                    name="username"
                    type="text"
                    value={values.username}
                    error={ errors.username ? true:false}
                    onChange={onChange}
                />
                <Form.Input
                    label="Password"
                    palceholder="Password.."
                    name="password"
                    type="password"
                    value={values.password}
                    error={ errors.password ? true:false}
                    onChange={onChange}
                />
                <Button type="submit" primary>
                    Login
                </Button>
            </Form>
            {
                Object.keys(errors).length > 0 &&(
                    <div className="ui error message">
                        <ul className="list">
                            {
                                Object.values(errors).map(value =>(<li key={value}>{value}</li>  ))
                            }
                        </ul>
                    </div>
                )
            }

        </div>
    );
};


const LOGIN_USER = gql`
    mutation login(
        $username:String!
        $password:String!
    ){
        login(
            username:$username
            password:$password
        ){
            id
            email
            token
            username
            createdAt
        }
    }
`
export default Login;
