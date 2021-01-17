import React,{useState} from 'react';
import {Button, Icon,Confirm} from "semantic-ui-react";
import {useMutation} from "@apollo/client";
import {FETCH_POSTS_QUERY} from "../util/graphql";
import gql from "graphql-tag";
import MyPopup from "../util/MyPopup";
function DeleteButton({postId,commentId,callback}) {
    const [confirmOpen,setConfirmOpen] = useState(false)
    const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION
    const [deletePostOrMutation] = useMutation(mutation,{
        update(proxy){
            setConfirmOpen(false)
            if(!commentId){
                const data = proxy.readQuery({
                    query:FETCH_POSTS_QUERY
                })
                let newData =[...data.getPosts]
                
                newData = newData.filter(p=> p.id !==postId)
                proxy.writeQuery({query:FETCH_POSTS_QUERY,
                    data: {
                        ...data,
                        getPosts: {
                            newData,
                        },
                    },
                })
            }
            if(callback) callback()
            // TODO: remove post from cache
        },

        variables:{
            postId:postId,
            commentId
        }
    })
    return (
        <>
            <MyPopup content={commentId?"Delete comment":"Delete Post"}>
                <Button color="red"
                        onClick={()=> setConfirmOpen(true)}
                        floated="right"
                >
                    <Icon  name="trash" style={{margin:0}}/>
                </Button>
            </MyPopup>
            <Confirm
                open={confirmOpen}
                onCancel={()=> setConfirmOpen(false)}
                onConfirm={deletePostOrMutation}
            />
        </>
    );
}
const DELETE_POST_MUTATION = gql`
    mutation deletePost($postId:ID!){
        deletePost(postId:$postId)
    }
`

const DELETE_COMMENT_MUTATION= gql`
    mutation deleteComment($postId:ID!,$commentId:ID!){
        deleteComment(postId:$postId,commentId:$commentId){
            id
            comments{
                id username createdAt body
            }
            commentCount
        }
    }
`

export default DeleteButton;