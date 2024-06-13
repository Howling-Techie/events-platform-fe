import {useContext, useEffect, useState} from "react";
import {UserContext} from "../contexts/UserContext.tsx";
import GroupInterface from "../interfaces/GroupInterface.ts";
import {getGroups} from "../services/API.ts";
import {GroupPreview} from "../components/Groups/GroupPreview.tsx";

export const Groups = () => {
    const currentUserContext = useContext(UserContext);

    const [groups, setGroups] = useState<GroupInterface[]>();

    useEffect(() => {
        if (currentUserContext && currentUserContext.loaded) {
            currentUserContext.checkTokenStatus();
            getGroups(currentUserContext.accessToken)
                .then(data => {
                    setGroups(data.groups);
                })
                .catch(error => console.error("Error fetching groups", error));
        }
    }, [currentUserContext]);

    return (
        <>
            <header className="flex flex-row space-x-2 items-center">
                <h1 className="text-2xl font-bold">Groups</h1>
                {currentUserContext && currentUserContext.user && <a
                    href="/groups/new"
                    className="m-2 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    aria-label="Create a Group"
                >
                    Create a Group
                </a>
                }
            </header>
            {!groups ? (
                <div>Loading Groups</div>
            ) : (
                <div className="space-y-1 divide-y divide-gray-300">
                    {currentUserContext && currentUserContext.user && <div>
                        <h2 className="text-lg font-semibold">Your Groups</h2>
                        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
                            {groups.filter(g => g.user_access_level).map((group) => (
                                <GroupPreview key={group.id} group={group}/>
                            ))}
                        </section>
                    </div>
                    }
                    <div>
                        <h2 className="text-lg font-semibold mt-2">Public Groups</h2>
                        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
                            {groups.filter(g => !g.user_access_level).map((group) => (
                                <GroupPreview key={group.id} group={group}/>
                            ))}
                        </section>
                    </div>
                </div>
            )}
        </>
    );
};