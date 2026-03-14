import { PersonalChatOuterCard } from "./PersonalChatOuterCard"


const PersonalChats=()=>{
return (
    <div>
    <div>Loop For Personal Chats</div>
    <PersonalChatOuterCard name="Manoj" read={true}/>
        <PersonalChatOuterCard name="karthik"/>

            <PersonalChatOuterCard name="sundar"/>
</div>
)
}
export default PersonalChats