import { deleteUser } from '../services/api';

const UserCard = ({ user, onDelete, onEdit }) => {
  const handleDelete = async () => {
    try {
      await deleteUser(user.id);
      onDelete(user.id);
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <div className="user-card-actions">
        <button onClick={() => onEdit(user)}>Edit</button>
        <button onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
};

export default UserCard;
