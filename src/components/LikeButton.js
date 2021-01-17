import React,{useState,useEffect} from 'react';

import {Link} from 'react-router-dom'

import {useMutation} from "@apollo/client";

import gql from "graphql-tag";

import {Button, Icon, Label} from "semantic-ui-react";
import MyPopup from "../util/MyPopup";
function LikeButton({post: {id, likes, likeCount}, user}) {
    const [liked,setLiked] = useState(false)
    useEffect(()=>{
        if(user && likes.find(like=> like.username===user.username)){

            setLiked(true)
        }else{
            setLiked(false)
        }
    },[user,likes])


    const [likePost] = useMutation(LIKE_POST_MUTATION,{
        variables:{postId:id}
    })

    const likePostHandle= ()=>{
        if(user){
            likePost()
                .then(res=> null)
                .catch(err=>null)
        }

    }
    const likeButton = user ? (
        liked ? (
            <Button color='teal'>
                <Icon name='heart' />

            </Button>
        ):(
            <Button color='teal' basic>
                <Icon name='heart' />

            </Button>
        )
    ):(
        <Button as={Link} to="/login" color='teal' basic>
            <Icon name='heart' />
        </Button>
    )

    return (
        <MyPopup content="Like Post">
            <Button as="div" labelPosition='right' onClick={likePostHandle} >
                {likeButton}
                <Label  basic color='teal' pointing='left'>
                    {likeCount}
                </Label>
            </Button>
        </MyPopup>

    );
}

const LIKE_POST_MUTATION= gql`
    mutation likePost($postId:ID!){
        likePost(postId:$postId){
            id
            likes{
                id 
                username
            }
            likeCount
        }
    }
`

export default LikeButton;