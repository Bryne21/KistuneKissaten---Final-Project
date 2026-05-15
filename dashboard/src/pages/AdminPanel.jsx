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
        // Ensure price is a number
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
            const response = await axios.post("http://localhost:1337/add-menu", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            alert("Menu Added Successfully to MongoDB!");
            clearForm();
            fetchMenu();
        } catch (error) {
            console.error("Add Error:", error);
            alert("Failed to add menu. " + (error.response?.data || "Check server connection."));
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
            alert("Menu Updated Successfully in MongoDB!");
            clearForm();
            fetchMenu();
        } catch (error) {
            console.error("Update Error:", error);
            alert("Failed to update menu. " + (error.response?.data || "Check server connection."));
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

    return (
        <div className="admin-theme">
            <header className="navbar">
                <div className="logo-container">
                    <div className="logo-circle">
                        <img src={logoImg} alt="Fox Logo" className="nav-logo" />
                    </div>
                    <div className="logo-text">
                        <span className="logo-jp">キツネ喫茶店</span>
                        <span className="logo-en">KITSUNE KISSATEN</span>
                        <span className="logo-loc">SOLANO, NUEVA VIZCAYA</span>
                    </div>
                </div>
                <nav className="main-nav">
                    <Link to="/#home">HOME</Link>
                    <Link to="/#menu">MENU</Link>
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
                <div className="AddMenuForm">
                    <h1>{editIndex !== null ? "Edit Menu Item" : "Add Menu Item"}</h1>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
                        <Avatar src={imagePreview} sx={{ width: 100, height: 100, mb: 2, border: '2px solid #EADAC2' }} variant="rounded" />
                        <Button variant="outlined" component="label" size="small" className="btn-edit">
                            Upload Photo
                            <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                        </Button>
                    </Box>

                    <TextField 
                        select 
                        label="Menu Location" 
                        fullWidth 
                        margin="normal" 
                        value={locationLabel} 
                        onChange={(e) => handleLocationChange(e.target.value)}
                    >
                        {locations.map((loc) => (
                            <MenuItem key={loc.label} value={loc.label}>{loc.label}</MenuItem>
                        ))}
                    </TextField>

                    <TextField label="Item ID" fullWidth margin="normal" value={menuId} disabled={editIndex !== null} onChange={(e) => setMenuId(e.target.value)} />
                    <TextField label="Name" fullWidth margin="normal" value={name} onChange={(e) => setName(e.target.value)} />
                    <TextField label="Description" fullWidth margin="normal" multiline rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
                    <TextField label="Price" fullWidth margin="normal" value={price} type="number" onChange={(e) => setPrice(e.target.value)} />
                    
                    <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                        {editIndex === null ? (
                            <Button variant="contained" className="btn-admin" onClick={handleAddMenu}>Add Menu</Button>
                        ) : (
                            <Button variant="contained" className="btn-admin-secondary" onClick={handleUpdateMenu}>Update Menu</Button>
                        )}
                        {editIndex !== null && <Button variant="text" onClick={clearForm} sx={{ color: '#888' }}>Cancel</Button>}
                    </Box>
                </div>

                <div className="Preview">
                    <h1>Menu List</h1>
                    <TableContainer sx={{ maxHeight: 600 }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Photo</TableCell>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Location</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Price</TableCell>
                                    <TableCell>Edit</TableCell>
                                    <TableCell>Delete</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {menuList.map((m) => (
                                    <TableRow key={m.id}>
                                        <TableCell><Avatar src={m.photo} variant="rounded" sx={{ width: 50, height: 50 }} /></TableCell>
                                        <TableCell><Typography variant="body2" sx={{ fontWeight: 600 }}>{m.id}</Typography></TableCell>
                                        <TableCell>{m.subcategory || m.category}</TableCell>
                                        <TableCell>{m.name}</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: '#D35400' }}>₱{m.price}</TableCell>
                                        <TableCell><Button variant="outlined" size="small" className="btn-edit" onClick={() => handleEdit(m)}>Edit</Button></TableCell>
                                        <TableCell><Button variant="outlined" size="small" className="btn-delete" onClick={() => handleDelete(m.id)}>Delete</Button></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>

                <div className="AddMenuForm">
                    <h1>Add User</h1>
                    <TextField label="Name" fullWidth margin="normal" value={userName} onChange={(e) => setUserName(e.target.value)} />
                    <TextField label="Email" fullWidth margin="normal" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} />
                    <TextField label="Password" type="password" fullWidth margin="normal" value={userPassword} onChange={(e) => setUserPassword(e.target.value)} />
                    <Button variant="contained" className="btn-admin" sx={{ mt: 2 }} onClick={handleAddUser}>Add User</Button>
                </div>
                
                <div className="Preview">
                    <h1>User List</h1>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Email</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map((u, i) => (
                                    <TableRow key={i}>
                                        <TableCell sx={{ fontWeight: 600 }}>{u.name}</TableCell>
                                        <TableCell>{u.email}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
        </div>
    );
}

export default AdminPanel;
