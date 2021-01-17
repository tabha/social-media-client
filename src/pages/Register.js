import React,{useState,useContext} from 'react';
import {Form,Button} from "semantic-ui-react";
import {useMutation} from "@apollo/client";
import useForm from '../util/hooks'
import gql from "graphql-tag";
import {AuthContext,AuthProvider} from '../context/auth'
const Register = (props) => {
    const {
        user,
        login,
        logout
    }= useContext(AuthContext)
    const [errors,setErrors] = useState({})

    const {onChange,onSubmit,values} = useForm(registerUser,{
        username:'',
        email:'',
        password:'',
        confirmPassword:'',
    })
    //const [values,setValues] = useState()
    const [addUser, {loading}] = useMutation(REGISTER_USER,{
        update(proxy,{data: {register:userData}}){
            login(userData)
            props.history.push("/")
        },
        onError(err){
            setErrors(err.graphQLErrors[0].extensions.exception.errors)
        },
        variables:values
    })

    function registerUser(){
        addUser()
            .then(res=>console.log(res))
            .catch(err=>console.log(err))
    }
    return (
        <div className="form-container">
            <Form onSubmit={onSubmit} noValidate className={loading?"loading":""}>
                 <h1>Register</h1>
                 <Form.Input
                    label="Username"
                    palceholder="Username.."
                    name="username"
                    type="text"
                    value={values.username}
                    error={errors.username ? true:false}
                    onChange={onChange}
                 />
                <Form.Input
                    label="Email"
                    palceholder="Email.."
                    name="email"
                    type="email"
                    error={errors.email ? true:false}
                    value={values.email}
                    onChange={onChange}
                />
                <Form.Input
                    label="Password"
                    palceholder="Password.."
                    name="password"
                    type="password"
                    value={values.password}
                    error={errors.password ? true:false}
                    onChange={onChange}
                />
                <Form.Input
                    label="ConfirmPassword"
                    palceholder="ConfirmPassword.."
                    name="confirmPassword"
                    value={values.confirmPassword}
                    error={errors.confirmPassword ? true:false}
                    type="password"
                    onChange={onChange}
                />
                <Button type="submit" primary>
                    Register
                </Button>
            </Form>
            {
                Object.keys(errors).length >0 &&(
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


const REGISTER_USER = gql`
    mutation register(
        $username:String!
        $email:String!
        $password:String!
        $confirmPassword:String!
    ){
        register(
            registerInput:{
                username:$username
                email:$email
                password:$password
                confirmPassword:$confirmPassword
            }
        ){
            id
            email
            token
            username
            createdAt
        }
    }
`
export default Register;
