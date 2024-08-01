import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserApi } from "../api/UserApi";
import { CookieApi } from "../api/CookieApi";

const pages = [
  {
    name: "Предметы",
    link: "/subjects"
  },
  {
    name: "Расписание",
    link: "/timetable",
    disabled: true,
  }
];

function NavBar(props) {

  const [loginDialog, setLoginDialog] = useState(props.needAuth || false);
  const [isReg, setReg] = useState(false);
  const [error, setError] = useState({});
  const [user, setUser] = useState({ login: false });

  const pushHistory = useNavigate();

  React.useEffect(() => {
    let userInfo = CookieApi.read("user_session");
    if (userInfo) {
      setUser({ login: true, data: JSON.parse(userInfo).data });
    }
  }, [props.forUpdate]);

  console.log(user);

  return (
    <React.Fragment>
      <AppBar position="static" sx={{ flex: "0 1 auto" }}>
        <div hidden>{props.forUpdate}</div>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              noWrap
              component="a"
              onClick={() => pushHistory("/")}
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: "-.0rem",
                color: "inherit",
                textDecoration: "none",
                cursor: "pointer"
              }}
            >
              StudTrain
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {pages.map((page) => (
                <Button
                  key={page.link}
                  disabled={page.disabled}
                  onClick={() => pushHistory(page.link)}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  {page.name}
                </Button>
              ))}
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <Button
                key="login"
                sx={{ my: 2, color: "white", display: "block" }}
                onClick={() => {
                  if (user.login) {
                    pushHistory("/user");
                  } else {
                    setLoginDialog(true);
                    setReg(false);
                    setError({});
                  }
                }}
              >
                { user.login ? (user.data.name != "" ? user.data.name : "Профиль") : "Войти" }
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Dialog
        open={loginDialog}
        onClose={() => setLoginDialog(false)}
        PaperProps={{
          component: "form",
          onSubmit: async (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const login = formJson.login;
            const password = formJson.password;
            const retry_password = formJson.retry_password;
            if (isReg) {
                if (!/\w*/.test(login)) {
                    setError({ login: "Логин должен содержать только числа и символы!" });
                } else if (password != retry_password || password == "") {
                    setError({ retry_password: "Пароли не совпадают!" });
                } else {
                    const result = await UserApi.regUser(login, password);
                    if (result.error) {
                      setError({ login: result.message });
                    } else {
                      setUser({ login: true, data: result.data.data });
                      setLoginDialog(false);
                    }
                }
            } else {
                if (!/\w*/.test(login)) {
                    setError({ login: "Логин должен содержать только числа и символы!" });
                } else {
                    const result = await UserApi.loginUser(login, password);
                    if (result.error) {
                      setError({ login: result.message });
                    } else {
                      setUser({ login: true, data: JSON.parse(result.data.data) });
                      setLoginDialog(false);
                    }
                }
            }
          },
        }}
        fullWidth
      >
        <DialogTitle>
          {isReg ? "Регистрация в системе" : "Вход в систему"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText hidden={!isReg}>
            Для окончания регистрации и получения доступа к ресурсам сайта
            необходимо, чтобы администратор принял вашу заявку.
          </DialogContentText>
          <TextField
            autoFocus
            defaultValue=""
            required
            margin="dense"
            id="name"
            name="login"
            label="Логин"
            type="text"
            fullWidth
            variant="outlined"
            error={error.login != undefined}
            helperText={error.login}
          />
          <TextField
            required
            defaultValue=""
            margin="dense"
            id="name2"
            name="password"
            label="Пароль"
            type="password"
            fullWidth
            variant="outlined"
            error={error.password != undefined}
            helperText={error.password}
          />
          {isReg && (
            <TextField
              required={isReg}
              defaultValue=""
              margin="dense"
              id="name3"
              name="retry_password"
              label="Повторите пароль"
              type="password"
              fullWidth
              variant="outlined"
              error={error.retry_password != undefined}
              helperText={error.retry_password}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setReg((prev) => !prev); setError({})} }>
            {isReg ? "Уже есть аккаунт" : "Регистрация"}
          </Button>
          <Button type="submit">
            {isReg ? "Зарегистрироваться" : "Войти"}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default NavBar;
