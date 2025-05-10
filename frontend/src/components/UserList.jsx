import { useState, useEffect } from 'react';
import { getAllUsers } from '../services/api';
import UserCard from './UserCard';
import UserForm from './UserForm';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch users');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUserSubmit = (user) => {
    if (editingUser) {
      setUsers(users.map(u => u.id === user.id ? user : u));
      setEditingUser(null);
    } else {
      setUsers([...users, user]);
    }
  };

  const handleDelete = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="user-list">
      <h2>{editingUser ? 'Edit User' : 'Create New User'}</h2>
      <UserForm
        user={editingUser}
        onSubmit={handleUserSubmit}
        onCancel={editingUser ? () => setEditingUser(null) : undefined}
      />
      
      <h2>Users</h2>
      <div className="users-grid">
        {users.map(user => (
          <UserCard
            key={user.id}
            user={user}
            onDelete={handleDelete}
            onEdit={setEditingUser}
          />
        ))}
      </div>
    </div>
  );
};

export default UserList;
