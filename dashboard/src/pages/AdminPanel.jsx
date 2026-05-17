import { useState, useEffect } from 'react';
import { 
    TextField, Button, Table, TableBody, TableRow, TableCell, 
    TableHead, TableContainer, Avatar, Box, Typography, MenuItem
} from "@mui/material";
import './AdminPanel.css';
import axios from "axios";
import { Link } from 'react-router-dom';
import logoImg from '../assets/kistunelogo.png';

function AdminPanel() {
    // Navigation State
    const [activeTab, setActiveTab] = useState('menu'); // 'menu' or 'staff'

    // Menu States
    const [menuId, setMenuId] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [subcategory, setSubcategory] = useState('');
    const [locationLabel, setLocationLabel] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [menuList, setMenuList] = useState([]);
    const [editIndex, setEditIndex] = useState(null);

    // User States
    const [users, setUsers] = useState([]);
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [userEditId, setUserEditId] = useState(null);

    const isAuthenticated = !!localStorage.getItem("token");

    const locations = [
        { label: "Croissants", category: "FOOD MENU", subcategory: "CROISSANT" },
        { label: "Pastas", category: "FOOD MENU", subcategory: "PASTA" },
        { label: "Brunch", category: "BRUNCH", subcategory: "" },
        { label: "Kohi (Coffee)", category: "DRINKS MENU", subcategory: "KOHI (COFFEE)" },
        { label: "Matcha", category: "DRINKS MENU", subcategory: "MATCHA" }
    ];

    const handleLocationChange = (val) => {
        setLocationLabel(val);
        const loc = locations.find(l => l.label === val);
        if (loc) {
            setCategory(loc.category);
            setSubcategory(loc.subcategory);
        } else {
            setCategory('');
            setSubcategory('');
        }
    };

    const handleSignOut = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/";
    };

    function fetchMenu() {
        axios.get("http://localhost:1337/menu")
            .then((response) => setMenuList(response.data))
            .catch((error) => console.error("Error fetching menu:", error));
    }

    function fetchUsers() {
        axios.get("http://localhost:1337/users-db")
            .then((res) => setUsers(res.data))
            .catch((err) => console.error("Error fetching users:", err));
    }

    useEffect(() => {
        fetchMenu();
        fetchUsers();
    }, []);

    const clearForm = () => {
        setMenuId('');
        setName('');
        setDescription('');
        setPrice('');
        setCategory('');
        setSubcategory('');
        setLocationLabel('');
        setSelectedFile(null);
        setImagePreview(null);
        setEditIndex(null);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const validateForm = () => {
        if (!menuId || !name || !price || !category) {
            alert("Error: Please fill in all required fields (ID, Name, Price, Location).");
            return false;
        }
        return true;
    };

    const handleEdit = (menu) => {
        setMenuId(menu.id);
        setName(menu.name);
        setDescription(menu.description || '');
        setPrice(menu.price);
        setCategory(menu.category || '');
        setSubcategory(menu.subcategory || '');
        const loc = locations.find(l => l.category === menu.category && l.subcategory === menu.subcategory);
        setLocationLabel(loc ? loc.label : '');
        setImagePreview(menu.photo);
        setEditIndex(menu.id);
    };

    async function handleAddMenu() {
        if (!validateForm()) return;

        const idExists = menuList.some(item => item.id === menuId);
        if (idExists) {
            alert("Error: Menu ID must be unique!");
            return;
        }

        const formData = new FormData();
        const menuData = { 
            id: menuId, 
            name, 
            description, 
            price: Number(price), 
            category, 
            subcategory 
        };

        formData.append("menuData", JSON.stringify(menuData));
        if (selectedFile) {
            formData.append("photo", selectedFile);
        }

        try {
            await axios.post("http://localhost:1337/add-menu", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            alert("Menu Added Successfully!");
            clearForm();
            fetchMenu();
        } catch (error) {
            console.error("Add Error:", error);
            alert("Failed to add menu.");
        }
    }

    async function handleUpdateMenu() {
        if (!validateForm()) return;

        const formData = new FormData();
        const menuData = { 
            id: menuId, 
            name, 
            description, 
            price: Number(price), 
            category, 
            subcategory 
        };

        formData.append("menuData", JSON.stringify(menuData));
        if (selectedFile) {
            formData.append("photo", selectedFile);
        }

        try {
            await axios.put(`http://localhost:1337/edit-menu/${editIndex}`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            alert("Menu Updated Successfully!");
            clearForm();
            fetchMenu();
        } catch (error) {
            console.error("Update Error:", error);
            alert("Failed to update menu.");
        }
    }

    async function handleDelete(id) {
        if (!window.confirm("Are you sure you want to delete?")) return;
        try {
            await axios.delete(`http://localhost:1337/delete-menu/${id}`);
            alert("Menu Deleted Successfully");
            fetchMenu();
        } catch (error) {
            console.error("Error deleting menu:", error);
        }
    }

    async function handleAddUser() {
        if (!userName || !userEmail || !userPassword) {
            alert("Please fill all user fields.");
            return;
        }
        try {
            await axios.post("http://localhost:1337/add-user-db", {
                name: userName, email: userEmail, password: userPassword
            });
            alert("User added successfully!");
            setUserName(''); setUserEmail(''); setUserPassword('');
            fetchUsers();
        } catch (err) {
            console.error(err);
        }
    }

    const handleUserEdit = (user) => {
        setUserName(user.name);
        setUserEmail(user.email);
        setUserPassword(user.password);
        setUserEditId(user._id);
    };

    async function handleUpdateUser() {
        if (!userName || !userEmail || !userPassword) {
            alert("Please fill all user fields.");
            return;
        }
        try {
            await axios.put(`http://localhost:1337/edit-user-db/${userEditId}`, {
                name: userName, email: userEmail, password: userPassword
            });
            alert("User updated successfully!");
            setUserName(''); setUserEmail(''); setUserPassword(''); setUserEditId(null);
            fetchUsers();
        } catch (err) {
            console.error(err);
            alert("Failed to update user.");
        }
    }

    async function handleDeleteUser(id) {
        if (!window.confirm("Delete this user?")) return;
        try {
            await axios.delete(`http://localhost:1337/delete-user-db/${id}`);
            alert("User deleted successfully!");
            fetchUsers();
        } catch (err) {
            console.error(err);
            alert("Failed to delete user.");
        }
    }

    return (
        <div className="admin-theme">
            <header className="navbar">
                <div className="logo-container">
                    <img src={logoImg} alt="Fox Logo" className="nav-logo" />
                    <div className="logo-text">
                        <span className="logo-jp">キツネ喫茶店</span>
                        <span className="logo-en">KITSUNE KISSATEN</span>
                        <span className="logo-loc">SOLANO, NUEVA VIZCAYA</span>
                    </div>
                </div>
                <nav className="main-nav">
                    <Link to="/#home">HOME</Link>
                    <Link to="/#menu-food">MENU</Link>
                    <Link to="/#about">ABOUT US</Link>
                    <Link to="/#contact">CONTACT</Link>
                    {isAuthenticated ? (
                        <>
                            <Link to="/students" className="active">ADMIN</Link>
                            <button onClick={handleSignOut} className="signout-btn">SIGN OUT</button>
                        </>
                    ) : (
                        <Link to="/login">LOGIN</Link>
                    )}
                </nav>
            </header>

            <div className="main">
                {/* ADMIN TABS */}
                <div className="admin-tabs">
                    <button 
                        className={`tab-btn ${activeTab === 'menu' ? 'active' : ''}`} 
                        onClick={() => setActiveTab('menu')}
                    >
                        Menu Management
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'staff' ? 'active' : ''}`} 
                        onClick={() => setActiveTab('staff')}
                    >
                        Staff Management
                    </button>
                </div>

                {activeTab === 'menu' && (
                    <div className="tab-content">
                        <div className="section-title">
                            <Typography variant="h4" sx={{ fontFamily: 'Playfair Display', color: '#1A100C', fontWeight: 700 }}>
                                Menu Management
                            </Typography>
                        </div>
                        
                        <div className="management-row">
                            <div className="form-container">
                                <div className="AddMenuForm">
                                    <h1>{editIndex !== null ? "Edit Menu Item" : "Add Menu Item"}</h1>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                                        <Avatar src={imagePreview} sx={{ width: 80, height: 80, mb: 1, border: '2px solid #EADAC2' }} variant="rounded" />
                                        <Button variant="outlined" component="label" size="small" className="btn-edit" sx={{ fontSize: '0.7rem' }}>
                                            Upload Photo
                                            <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                                        </Button>
                                    </Box>
                                    <TextField select label="Location" fullWidth size="small" margin="dense" value={locationLabel} onChange={(e) => handleLocationChange(e.target.value)}>
                                        {locations.map((loc) => (<MenuItem key={loc.label} value={loc.label}>{loc.label}</MenuItem>))}
                                    </TextField>
                                    <TextField label="Item ID" fullWidth size="small" margin="dense" value={menuId} disabled={editIndex !== null} onChange={(e) => setMenuId(e.target.value)} />
                                    <TextField label="Name" fullWidth size="small" margin="dense" value={name} onChange={(e) => setName(e.target.value)} />
                                    <TextField label="Description" fullWidth size="small" margin="dense" multiline rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
                                    <TextField label="Price" fullWidth size="small" margin="dense" value={price} type="number" onChange={(e) => setPrice(e.target.value)} />
                                    <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                                        {editIndex === null ? (
                                            <Button variant="contained" className="btn-admin" onClick={handleAddMenu}>Add Menu</Button>
                                        ) : (
                                            <Button variant="contained" className="btn-admin-secondary" onClick={handleUpdateMenu}>Update Menu</Button>
                                        )}
                                        {editIndex !== null && <Button variant="text" onClick={clearForm}>Cancel</Button>}
                                    </Box>
                                </div>
                            </div>
                            
                            <div className="list-container">
                                <div className="Preview">
                                    <h1>Menu List</h1>
                                    <TableContainer sx={{ maxWidth: '100%', overflowX: 'auto' }}>
                                        <Table stickyHeader size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Photo</TableCell>
                                                    <TableCell>ID</TableCell>
                                                    <TableCell>Name</TableCell>
                                                    <TableCell>Price</TableCell>
                                                    <TableCell>Actions</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {menuList.map((m) => (
                                                    <TableRow key={m.id}>
                                                        <TableCell><Avatar src={m.photo} variant="rounded" sx={{ width: 40, height: 40 }} /></TableCell>
                                                        <TableCell>{m.id}</TableCell>
                                                        <TableCell>{m.name}</TableCell>
                                                        <TableCell>₱{m.price}</TableCell>
                                                        <TableCell>
                                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                                <Button size="small" variant="outlined" className="btn-edit" onClick={() => handleEdit(m)}>Edit</Button>
                                                                <Button size="small" variant="outlined" className="btn-delete" onClick={() => handleDelete(m.id)}>Del</Button>
                                                            </Box>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'staff' && (
                    <div className="tab-content">
                        {/* USER SECTION */}
                        <div className="section-title">
                            <Typography variant="h4" sx={{ fontFamily: 'Playfair Display', color: '#1A100C', fontWeight: 700 }}>
                                Staff Management
                            </Typography>
                        </div>

                        <div className="management-row staff-row">
                            <div className="form-container">
                                <div className="AddMenuForm">
                                    <h1>{userEditId ? "Edit User" : "Add User"}</h1>
                                    <TextField label="Name" fullWidth size="small" margin="dense" value={userName} onChange={(e) => setUserName(e.target.value)} />
                                    <TextField label="Email" fullWidth size="small" margin="dense" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} />
                                    <TextField label="Password" type="password" fullWidth size="small" margin="dense" value={userPassword} onChange={(e) => setUserPassword(e.target.value)} />
                                    <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                                        {userEditId ? (
                                            <Button variant="contained" className="btn-admin-secondary" onClick={handleUpdateUser}>Update User</Button>
                                        ) : (
                                            <Button variant="contained" className="btn-admin" onClick={handleAddUser}>Add User</Button>
                                        )}
                                        {userEditId && <Button variant="text" onClick={() => { setUserName(''); setUserEmail(''); setUserPassword(''); setUserEditId(null); }}>Cancel</Button>}
                                    </Box>
                                </div>
                            </div>

                            <div className="list-container">
                                <div className="Preview">
                                    <h1>User List</h1>
                                    <TableContainer sx={{ overflowX: 'auto' }}>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Name</TableCell>
                                                    <TableCell>Email</TableCell>
                                                    <TableCell>Actions</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {users.map((u, i) => (
                                                    <TableRow key={u._id || i}>
                                                        <TableCell>{u.name}</TableCell>
                                                        <TableCell>{u.email}</TableCell>
                                                        <TableCell>
                                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                                <Button size="small" variant="outlined" className="btn-edit" onClick={() => handleUserEdit(u)}>Edit</Button>
                                                                <Button size="small" variant="outlined" className="btn-delete" onClick={() => handleDeleteUser(u._id)}>Del</Button>
                                                            </Box>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminPanel;
