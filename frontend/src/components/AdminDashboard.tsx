import React, { useEffect } from "react";
import { logout } from "../auth";
import { Task } from "../types";
import { useNavigate } from "react-router-dom";
import { useToast } from "../contexts/ToastContext";
import { ALL_TASKS } from "../GQL/queries";
import { DELETE_TASK } from "../GQL/mutations";
import { useGqlQuery } from "../hooks/useGraphQL";
import { AppBar, Toolbar, Button, Typography, Container, CircularProgress } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import LogoutIcon from "@mui/icons-material/Logout";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { loading, data, refetch } = useGqlQuery<{ tasks: Task[] }, { input: Task }>({ query: ALL_TASKS });
  const { save: deleteTask } = useGqlQuery({ query: ALL_TASKS, mutation: DELETE_TASK });

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleDeleteTask = async (id: number) => {
    await deleteTask({ id: id });
    refetch();
    showToast("Task deleted successfully!");
  };

  if (loading) return <CircularProgress />;

  const tasks: Task[] = data?.tasks || [];

  const columns: GridColDef[] = [
    { field: "title", headerName: "Title", width: 150 },
    { field: "description", headerName: "Description", width: 300 },
    { field: "status", headerName: "Status", width: 130 },
    { field: "priority", headerName: "Priority", width: 130 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Button
          variant='contained'
          color='secondary'
          onClick={() => handleDeleteTask(params.row.id)}
        >
          Delete Task
        </Button>
      )
    }
  ];

  return (
    <div>
      <AppBar position='static'>
        <Toolbar>
          <Typography
            variant='h6'
            style={{ flexGrow: 1 }}
          >
            Admin Dashboard
          </Typography>
          <Button
            color='inherit'
            onClick={() => navigate("/dashboard/book")}
          >
            Add Tasks
          </Button>
          <Button
            color='inherit'
            onClick={() => navigate("/dashboard/user")}
          >
            Add Users
          </Button>
          <Button
            color='inherit'
            onClick={() => navigate("/dashboard/pass")}
          >
            Change Password
          </Button>
          <Button
            color='inherit'
            startIcon={<LogoutIcon />}
            onClick={logout}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Container style={{ marginTop: "20px" }}>
        <Typography
          variant='h5'
          gutterBottom
        >
          Task List
        </Typography>
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={tasks}
            columns={columns}
            disableRowSelectionOnClick
          />
        </div>
      </Container>
    </div>
  );
};

export default AdminDashboard;
