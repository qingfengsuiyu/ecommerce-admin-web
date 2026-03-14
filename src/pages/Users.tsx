import { Select, Table, message } from "antd";
import { useEffect, useState } from "react";
import { getUsers, updateUserRole } from "../api/users";

function Users() {
  const [users, setUsers] = useState<any>(null);
  const handleUsersChange = async (id: string, role: string) => {
    try {
      await updateUserRole(id, role);
      message.success("权限更新成功");
      fetchUsers();
    } catch (e) {}
  };
  const columns = [
    { title: "用户名", dataIndex: "username" },
    { title: "邮箱", dataIndex: "email" },
    {
      title: "角色",
      dataIndex: "user",
      render: (_: any, record: any) => (
        <Select
          value={record.role}
          style={{ width: 120 }}
          onChange={(value) => handleUsersChange(record._id, value)}
          options={[
            { label: "管理员", value: "admin" },
            { label: "编辑者", value: "edit" },
            { label: "参观者", value: "viewer" },
          ]}
        />
      ),
    },
    { title: "注册时间", dataIndex: "createdAt" },
  ];

  const fetchUsers = async () => {
    const res = await getUsers();
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h1 style={{ marginBottom: "10px" }}>用户管理</h1>
      <Table columns={columns} dataSource={users} rowKey="_id"></Table>
    </div>
  );
}

export default Users;
