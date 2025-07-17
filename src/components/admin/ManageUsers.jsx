import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  message,
  Popconfirm,
  Card,
  Typography,
  Tag,
  Divider,
  Row,
  Col,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  ReloadOutlined,
} from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch all users from API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/admin/users', {
        method: 'GET',
        headers: {
          'admin-email': 'zconnect.admin@gmail.com',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setUsers(data.data);
        message.success(`Loaded ${data.data.length} users successfully`);
      } else {
        message.error(data.message || 'Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Failed to connect to server. Please check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  // Handle creating a new user
  const handleCreateUser = async (values) => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/users', {
        method: 'POST',
        headers: {
          'admin-email': 'zconnect.admin@gmail.com',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        message.success('User created successfully');
        setModalVisible(false);
        form.resetFields();
        fetchUsers(); // Refresh the user list
      } else {
        message.error(data.message || 'Failed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      message.error('Failed to create user. Please check backend connection.');
    }
  };

  // Handle updating an existing user
  const handleUpdateUser = async (values) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'admin-email': 'zconnect.admin@gmail.com',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        message.success('User updated successfully');
        setModalVisible(false);
        setEditingUser(null);
        form.resetFields();
        fetchUsers(); // Refresh the user list
      } else {
        message.error(data.message || 'Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      message.error('Failed to update user. Please check backend connection.');
    }
  };

  // Handle deleting a user
  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'admin-email': 'zconnect.admin@gmail.com',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        message.success('User deleted successfully');
        fetchUsers(); // Refresh the user list
      } else {
        message.error(data.message || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      message.error('Failed to delete user. Please check backend connection.');
    }
  };

  // Handle form submission
  const handleSubmit = (values) => {
    if (editingUser) {
      handleUpdateUser(values);
    } else {
      handleCreateUser(values);
    }
  };

  // Open modal for creating new user
  const openCreateModal = () => {
    setEditingUser(null);
    form.resetFields();
    setModalVisible(true);
  };

  // Open modal for editing existing user
  const openEditModal = (user) => {
    setEditingUser(user);
    form.setFieldsValue({
      name: user.name,
      email: user.email,
      role: user.role,
      specialization: user.specialization,
    });
    setModalVisible(true);
  };

  // Close modal
  const handleCancel = () => {
    setModalVisible(false);
    setEditingUser(null);
    form.resetFields();
  };

  // Table columns configuration
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text) => (
        <Space>
          <UserOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      filters: [
        { text: 'Admin', value: 'admin' },
        { text: 'Counselor', value: 'counselor' },
        { text: 'Staff', value: 'staff' },
        { text: 'User', value: 'user' },
      ],
      onFilter: (value, record) => record.role === value,
      render: (role) => {
        let color = 'default';
        if (role === 'admin') color = '#AF5D73';
        else if (role === 'counselor') color = '#AF5D73';
        else if (role === 'staff') color = '#AF5D73';
        else if (role === 'user') color = '#AF5D73';
        
        return <Tag color={color}>{role.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Specialization',
      dataIndex: 'specialization',
      key: 'specialization',
      render: (text) => text || '-',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => openEditModal(record)}
            style={{ backgroundColor: '#AF5D73', borderColor: '#AF5D73' }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this user?"
            onConfirm={() => handleDeleteUser(record.id)}
            okText="Yes"
            cancelText="No"
            disabled={record.role === 'admin'}
          >
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              size="small"
              disabled={record.role === 'admin'}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '0' }}>
      <Card>
        <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
          <Col>
            <Title level={2} style={{ margin: 0, color: '#AF5D73' }}>
              <UserOutlined style={{ marginRight: 8 }} />
              Manage Users
            </Title>
          </Col>
          <Col>
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchUsers}
                loading={loading}
              >
                Refresh
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={openCreateModal}
                style={{ backgroundColor: '#AF5D73', borderColor: '#AF5D73' }}
              >
                Add New User
              </Button>
            </Space>
          </Col>
        </Row>

        <Divider />

        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={loading}
          pagination={{
            total: users.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} users`,
          }}
          scroll={{ x: 800 }}
        />
      </Card>

      {/* Create/Edit User Modal */}
      <Modal
        title={
          <Space>
            <UserOutlined />
            {editingUser ? 'Edit User' : 'Create New User'}
          </Space>
        }
        open={modalVisible}
        onCancel={handleCancel}
        footer={null}
        width={600}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark="optional"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Full Name"
                name="name"
                rules={[
                  { required: true, message: 'Please enter the full name' },
                  { min: 2, message: 'Name must be at least 2 characters' },
                ]}
              >
                <Input placeholder="Enter full name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Email Address"
                name="email"
                rules={[
                  { required: true, message: 'Please enter the email address' },
                  { type: 'email', message: 'Please enter a valid email' },
                ]}
              >
                <Input placeholder="Enter email address" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Role"
                name="role"
                rules={[{ required: true, message: 'Please select a role' }]}
              >
                <Select placeholder="Select user role">
                  <Option value="user">User</Option>
                  <Option value="staff">Staff</Option>
                  <Option value="counselor">Counselor</Option>
                  <Option value="admin">Admin</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Specialization"
                name="specialization"
                tooltip="Only required for counselors"
              >
                <Input placeholder="e.g., Anxiety, Depression, Career" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Password"
            name="password"
            rules={
              !editingUser
                ? [
                    { required: true, message: 'Please enter a password' },
                    { min: 6, message: 'Password must be at least 6 characters' },
                  ]
                : [
                    { min: 6, message: 'Password must be at least 6 characters' },
                  ]
            }
            help={
              editingUser
                ? 'Leave blank to keep current password'
                : 'Minimum 6 characters required'
            }
          >
            <Input.Password
              placeholder={
                editingUser ? 'Leave blank to keep current' : 'Enter password'
              }
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={handleCancel}>Cancel</Button>
              <Button
                type="primary"
                htmlType="submit"
                style={{ backgroundColor: '#AF5D73', borderColor: '#AF5D73' }}
              >
                {editingUser ? 'Update User' : 'Create User'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageUsers;