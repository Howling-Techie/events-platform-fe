import {NavBar} from "./components/NavBar.tsx";
import {Route, Routes} from "react-router-dom";
import {Home} from "./pages/Home.tsx";
import {Groups} from "./pages/Groups.tsx";
import {Group} from "./pages/Group.tsx";
import {Events} from "./pages/Events.tsx";
import {Event} from "./pages/Event.tsx";
import {EditGroup} from "./pages/EditGroup.tsx";
import {UserSignIn} from "./pages/UserSignIn.tsx";
import {UserSignOut} from "./pages/UserSignOut.tsx";
import {NewGroup} from "./pages/NewGroup.tsx";
import {NewEvent} from "./pages/NewEvent.tsx";
import {Profile} from "./pages/Profile.tsx";
import {User} from "./pages/User.tsx";
import {Users} from "./pages/Users.tsx";
import {EditEvent} from "./pages/EditEvent.tsx";
import {GroupInvites} from "./pages/GroupInvites.tsx";
import {EventInvites} from "./pages/EventInvites.tsx";
import {Error} from "./pages/Error.tsx";

function App() {

    return (
        <div className="flex flex-col min-h-screen">
            <NavBar/>
            <div className="container mx-auto px-4 py-4 max-w-screen-xl flex flex-grow flex-col">
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/error" element={<Error/>}/>
                    <Route path="/groups" element={<Groups/>}/>
                    <Route path="/groups/new" element={<NewGroup/>}/>
                    <Route path="/groups/:group_id" element={<Group/>}/>
                    <Route path="/groups/:group_id/edit" element={<EditGroup/>}/>
                    <Route path="/groups/:group_id/invite" element={<GroupInvites/>}/>
                    <Route path="/events" element={<Events/>}/>
                    <Route path="/events/new" element={<NewEvent/>}/>
                    <Route path="/events/:event_id" element={<Event/>}/>
                    <Route path="/events/:event_id/edit" element={<EditEvent/>}/>
                    <Route path="/events/:event_id/invite" element={<EventInvites/>}/>
                    <Route path="/users" element={<Users/>}/>
                    <Route path="/users/:username" element={<User/>}/>
                    <Route path="/profile" element={<Profile/>}/>
                    <Route path="/signin" element={<UserSignIn/>}/>
                    <Route path="/signout" element={<UserSignOut/>}/>
                </Routes>
            </div>
        </div>
    );
}

export default App;
