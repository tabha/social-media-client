import React from 'react';
import gql from "graphql-tag";
import {Form,Button} from "semantic-ui-react";
import useForm from '../util/hooks'
import {useMutation} from "@apollo/client";
import {FETCH_POSTS_QUERY} from "../util/graphql";

function PostForm(props) {
    const {values,onChange,onSubmit} = useForm(createPostCallback,{
        body:''
    })
    const [createPost, {error}] = useMutation(CREATE_POST_MUTATION,{
        variables:values,
        update(proxy,result){
            const data = proxy.readQuery({
                query:FETCH_POSTS_QUERY
            })
            const newData = [...data.getPosts,result.data.createPost];

            proxy.writeQuery({
                query: FETCH_POSTS_QUERY,
                data: {
                    ...data,
                    getPosts: {
                        newData,
                    },
                },
            });
            values.body=""
        },

    })

    function createPostCallback(){
        createPost()
            .then(res=>console.log(res))
            .catch(err=> console.log(err))

    }
    return (
        <>
            <Form onSubmit={onSubmit}>
                <h2>Create a post:</h2>
                <Form.Field>
                    <Form.Input
                        placeholder="Hi world"
                        name="body"
                        onChange={onChange}
                        value={values.body}
                        error={error ? true : false}
                    />
                    <Button type="submit" color="teal">
                        Submit
                    </Button>
                </Form.Field>
            </Form>
            {error && (
                <div className="ui error message" style={{marginBottom:20}}>
                    <li>{error.graphQLErrors[0].message}</li>
                </div>
            )}
        </>
    );
}

const CREATE_POST_MUTATION = gql`
    mutation createPost($body:String!){
        createPost(body:$body){
            id body createdAt username
            likes{
                id username createdAt
            }
            likeCount
            comments{
                id body username createdAt
            }
            commentCount
        }
    }
`


export default PostForm;