import { Alert, Button, Skeleton, TextField } from "@mui/material";
import NavBar from "../components/Navbar";
import { UserApi } from "../api/UserApi";
import React from "react";
import { CheckCircleOutline } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

function UserPage() {

    const pushHistory = useNavigate();

    const [user, setUser] = React.useState({ login: false, changed: false, successUpdate: false });
    const [update, setUpdate] = React.useState(false);

    async function fetchUser() {
        const userData = await UserApi.fetchUserData();
        setUser({ login: true, changed: false, userData: userData.data });
    }

    function updateUserField(name, event) {
        setUser(prev => ({
            ...prev,
            changed: true,
            successUpdate: false,
            userData: {
                ...prev.userData,
                [name]: event.target.value
            }
        }));
    }

    async function updateUser() {
        const result = await UserApi.updateUserData(user.userData);
        if (result.error == false) {
            setUser(prev => ({
                ...prev,
                changed: false,
                successUpdate: true,
            }));
            setUpdate(prev => !prev);
            setTimeout(() => {
                setUser(prev => ({
                    ...prev,
                    successUpdate: false,
                }))
            }, 3000);
        }
    }

    async function logoutUser() {
        const result = await UserApi.logoutUser();
        if (result.error == false) {
            setUpdate(prev => !prev);
            pushHistory("/");
        }
    }

    React.useEffect(() => {
        fetchUser();
    }, []);


    return <>
        <NavBar forUpdate={update} />
        <div style={{ padding: 16, paddingTop: 0, maxWidth: 500 }}>
            <h2>Личный кабинет</h2>
            { user.successUpdate && <Alert style={{ marginBottom: 12 }}icon={<CheckCircleOutline fontSize="inherit" />} severity="success">
                Данные успешно сохранены!
            </Alert> 
            }
            { user.login == true ?
            <>
                <div>
                    <TextField onChange={(ev) => updateUserField("name", ev)} defaultValue={user.userData.name} style={{ marginBottom: 12 }} label="Ваше имя:" fullWidth/>
                    <TextField defaultValue={user.userData.login} style={{ marginBottom: 12 }} disabled label="Ваш логин:" fullWidth variant="filled"/>
                    <TextField defaultValue={user.userData.status} style={{ marginBottom: 12 }} disabled label="Вид пользователя:" fullWidth variant="filled"/>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Button onClick={logoutUser}>Выйти</Button>
                    <Button disabled={!user.changed} onClick={updateUser}>Сохранить изменения</Button>
                </div>
            </>
            : <>
                <div>
                    <Skeleton width={"100%"} height={56} style={{ marginBottom: 12 }}/>
                    <Skeleton width={"100%"} height={56} style={{ marginBottom: 12 }}/>
                    <Skeleton width={"100%"} height={56} style={{ marginBottom: 12 }}/>
                </div>
            </>
                
            }
        </div>
    </>
}

export default UserPage;