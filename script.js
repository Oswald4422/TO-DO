// Initialize data structures
let users = JSON.parse(localStorage.getItem('users') || '[]');
let members = JSON.parse(localStorage.getItem('members') || '[]');
let payments = JSON.parse(localStorage.getItem('payments') || '[]');
let currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
let editingMember = null;
let editingPayment = null;

// Authentication Functions
function switchToSignup() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('signupForm').style.display = 'block';
}

function switchToLogin() {
    document.getElementById('signupForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.nextElementSibling;
    
    if (input.type === 'password') {
        input.type = 'text';
        button.innerHTML = '<span>🙈</span>';
    } else {
        input.type = 'password';
        button.innerHTML = '<span>👁️</span>';
    }
}

// Check if user is logged in
function checkAuth() {
    if (window.location.pathname.includes('homepage.html') || 
        window.location.pathname.includes('members.html') || 
        window.location.pathname.includes('payments.html')) {
        if (!currentUser) {
            window.location.href = 'index.html';
        }
    }
}

// Handle login
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    
    // Login form handler
    const loginForm = document.getElementById('loginFormElement');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                currentUser = user;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                window.location.href = 'homepage.html';
            } else {
                alert('Invalid email or password');
            }
        });
    }
    
    // Signup form handler
    const signupForm = document.getElementById('signupFormElement');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const fullName = document.getElementById('signupFullName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }
            
            if (users.find(u => u.email === email)) {
                alert('Email already exists');
                return;
            }
            
            const newUser = {
                id: Date.now(),
                fullName,
                email,
                password
            };
            
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            
            alert('Account created successfully! Please log in.');
            switchToLogin();
        });
    }
    
    // Initialize homepage if we're on it
    if (document.getElementById('dashboard')) {
        initializeHomepage();
    }
});

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    window.location.href = 'authentication.html';
}

// Homepage Functions
function initializeHomepage() {
    updateDashboardStats();
    loadMembers();
    loadPayments();
    
    // Navigation handlers
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Sidebar navigation
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            showPage(page);
            
            sidebarLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Member form handler
    const memberForm = document.getElementById('addMemberForm');
    if (memberForm) {
        memberForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('memberName').value;
            const email = document.getElementById('memberEmail').value;
            const dob = document.getElementById('memberDob').value;
            
            if (editingMember) {
                // Update existing member
                const index = members.findIndex(m => m.id === editingMember.id);
                members[index] = {
                    ...editingMember,
                    name,
                    email,
                    dob
                };
                editingMember = null;
                document.getElementById('memberModalTitle').textContent = 'Add New Member';
                document.querySelector('#addMemberForm button[type="submit"]').textContent = 'Add Member';
            } else {
                // Add new member
                const newMember = {
                    id: Date.now(),
                    name,
                    email,
                    dob
                };
                members.push(newMember);
            }
            
            localStorage.setItem('members', JSON.stringify(members));
            loadMembers();
            updateDashboardStats();
            closeAddMemberModal();
        });
    }
    
    // Payment form handler
    const paymentForm = document.getElementById('addPaymentForm');
    if (paymentForm) {
        paymentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const memberName = document.getElementById('paymentMember').value;
            const paymentType = document.getElementById('paymentType').value;
            const paymentMode = document.getElementById('paymentMode').value;
            const amount = parseFloat(document.getElementById('paymentAmount').value);
            const description = document.getElementById('paymentDescription').value;
            
            if (editingPayment) {
                // Update existing payment
                const index = payments.findIndex(p => p.id === editingPayment.id);
                payments[index] = {
                    ...editingPayment,
                    memberName,
                    paymentType,
                    paymentMode,
                    amount,
                    description
                };
                editingPayment = null;
                document.getElementById('paymentModalTitle').textContent = 'Add New Payment';
                document.querySelector('#addPaymentForm button[type="submit"]').textContent = 'Add Payment';
            } else {
                // Add new payment
                const newPayment = {
                    id: Date.now(),
                    memberName,
                    paymentType,
                    paymentMode,
                    amount,
                    description
                };
                payments.push(newPayment);
            }
            
            localStorage.setItem('payments', JSON.stringify(payments));
            loadPayments();
            updateDashboardStats();
            closeAddPaymentModal();
        });
    }
}

function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
}

function updateDashboardStats() {
    document.getElementById('totalMembers').textContent = members.length;
    document.getElementById('totalPayments').textContent = payments.length;
    
    const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
    document.getElementById('totalAmount').textContent = `$${totalAmount.toFixed(2)}`;
}

// Member Functions
function loadMembers() {
    const tbody = document.getElementById('membersTableBody');
    
    if (members.length === 0) {
        tbody.innerHTML = '<tr class="no-data"><td colspan="4">No data</td></tr>';
        return;
    }
    
    tbody.innerHTML = members.map(member => `
        <tr>
            <td>${member.name}</td>
            <td>${member.email}</td>
            <td>${member.dob}</td>
            <td>
                <button class="action-btn" onclick="editMember(${member.id})">Edit</button>
                <button class="action-btn delete" onclick="deleteMember(${member.id})">Delete</button>
            </td>
        </tr>
    `).join('');
    
    // Update payment member dropdown
    updatePaymentMemberDropdown();
}

function searchMembers() {
    const searchTerm = document.getElementById('memberSearch').value.toLowerCase();
    const filteredMembers = members.filter(member => 
        member.name.toLowerCase().includes(searchTerm) ||
        member.email.toLowerCase().includes(searchTerm)
    );
    
    const tbody = document.getElementById('membersTableBody');
    
    if (filteredMembers.length === 0) {
        tbody.innerHTML = '<tr class="no-data"><td colspan="4">No data</td></tr>';
        return;
    }
    
    tbody.innerHTML = filteredMembers.map(member => `
        <tr>
            <td>${member.name}</td>
            <td>${member.email}</td>
            <td>${member.dob}</td>
            <td>
                <button class="action-btn" onclick="editMember(${member.id})">Edit</button>
                <button class="action-btn delete" onclick="deleteMember(${member.id})">Delete</button>
            </td>
        </tr>
    `).join('');
}

function openAddMemberModal() {
    document.getElementById('addMemberModal').style.display = 'block';
    document.getElementById('addMemberForm').reset();
    editingMember = null;
    document.getElementById('memberModalTitle').textContent = 'Add New Member';
    document.querySelector('#addMemberForm button[type="submit"]').textContent = 'Add Member';
}

function closeAddMemberModal() {
    document.getElementById('addMemberModal').style.display = 'none';
    editingMember = null;
}

function editMember(id) {
    const member = members.find(m => m.id === id);
    if (member) {
        editingMember = member;
        document.getElementById('memberName').value = member.name;
        document.getElementById('memberEmail').value = member.email;
        document.getElementById('memberDob').value = member.dob;
        document.getElementById('memberModalTitle').textContent = 'Edit Member';
        document.querySelector('#addMemberForm button[type="submit"]').textContent = 'Update Member';
        document.getElementById('addMemberModal').style.display = 'block';
    }
}

function deleteMember(id) {
    if (confirm('Are you sure you want to delete this member?')) {
        members = members.filter(m => m.id !== id);
        localStorage.setItem('members', JSON.stringify(members));
        loadMembers();
        updateDashboardStats();
        
        // Remove associated payments
        payments = payments.filter(p => {
            const member = members.find(m => m.name === p.memberName);
            return member !== undefined;
        });
        localStorage.setItem('payments', JSON.stringify(payments));
        loadPayments();
    }
}

// Payment Functions
function loadPayments() {
    const tbody = document.getElementById('paymentsTableBody');
    
    if (payments.length === 0) {
        tbody.innerHTML = '<tr class="no-data"><td colspan="6">No data</td></tr>';
        return;
    }
    
    tbody.innerHTML = payments.map(payment => `
        <tr>
            <td>${payment.memberName}</td>
            <td>${payment.paymentType}</td>
            <td>${payment.paymentMode}</td>
            <td>$${payment.amount.toFixed(2)}</td>
            <td>${payment.description || '-'}</td>
            <td>
                <button class="action-btn" onclick="editPayment(${payment.id})">Edit</button>
                <button class="action-btn delete" onclick="deletePayment(${payment.id})">Delete</button>
            </td>
        </tr>
    `).join('');
}

function updatePaymentMemberDropdown() {
    const select = document.getElementById('paymentMember');
    if (select) {
        select.innerHTML = '<option value="">Select a member</option>' + 
            members.map(member => `<option value="${member.name}">${member.name}</option>`).join('');
    }
}

function openAddPaymentModal() {
    document.getElementById('addPaymentModal').style.display = 'block';
    document.getElementById('addPaymentForm').reset();
    editingPayment = null;
    document.getElementById('paymentModalTitle').textContent = 'Add New Payment';
    document.querySelector('#addPaymentForm button[type="submit"]').textContent = 'Add Payment';
    updatePaymentMemberDropdown();
}

function closeAddPaymentModal() {
    document.getElementById('addPaymentModal').style.display = 'none';
    editingPayment = null;
}

function editPayment(id) {
    const payment = payments.find(p => p.id === id);
    if (payment) {
        editingPayment = payment;
        updatePaymentMemberDropdown();
        document.getElementById('paymentMember').value = payment.memberName;
        document.getElementById('paymentType').value = payment.paymentType;
        document.getElementById('paymentMode').value = payment.paymentMode;
        document.getElementById('paymentAmount').value = payment.amount;
        document.getElementById('paymentDescription').value = payment.description || '';
        document.getElementById('paymentModalTitle').textContent = 'Edit Payment';
        document.querySelector('#addPaymentForm button[type="submit"]').textContent = 'Update Payment';
        document.getElementById('addPaymentModal').style.display = 'block';
    }
}

function deletePayment(id) {
    if (confirm('Are you sure you want to delete this payment?')) {
        payments = payments.filter(p => p.id !== id);
        localStorage.setItem('payments', JSON.stringify(payments));
        loadPayments();
        updateDashboardStats();
    }
}

// Close modals when clicking outside
window.onclick = function(event) {
    const memberModal = document.getElementById('addMemberModal');
    const paymentModal = document.getElementById('addPaymentModal');
    
    if (event.target === memberModal) {
        closeAddMemberModal();
    }
    if (event.target === paymentModal) {
        closeAddPaymentModal();
    }
}