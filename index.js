class Room {
    constructor(number, capacity) {
        this.number = number;
        this.capacity = capacity;
        this.reservations = [];
    }

    isAvailable(date, startTime, duration) {
        return !this.reservations.some(reservation => {
            const reservationStart = new Date(`${reservation.date}T${reservation.startTime}`);
            const reservationEnd = new Date(reservationStart.getTime() + reservation.duration * 60 * 60 * 1000);
            const newStart = new Date(`${date}T${startTime}`);
            const newEnd = new Date(newStart.getTime() + duration * 60 * 60 * 1000);

            return (newStart < reservationEnd && newEnd > reservationStart);
        });
    }

    addReservation(reservation) {
        this.reservations.push(reservation);
    }

    removeReservation(reservation) {
        const index = this.reservations.indexOf(reservation);
        if (index > -1) {
            this.reservations.splice(index, 1);
        }
    }
}

class Reservation {
    constructor(name, roomNumber, date, startTime, duration) {
        this.name = name;
        this.roomNumber = roomNumber;
        this.date = date;
        this.startTime = startTime;
        this.duration = duration;
    }
}

// Inisialisasi data
const rooms = [
    new Room(101, 30),
    new Room(102, 25),
    new Room(103, 40)
];

// Fungsi untuk memperbarui tampilan
function updateRoomList() {
    const tbody = document.querySelector('#roomList tbody');
    tbody.innerHTML = '';
    
    rooms.forEach(room => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${room.number}</td>
            <td>${room.capacity}</td>
            <td>${room.reservations.length === 0 ? 'Tersedia' : 'Telah di pesan'}</td>
        `;
        tbody.appendChild(tr);
    });

    // Update room select options
    const select = document.getElementById('roomNumber');
    select.innerHTML = '';
    rooms.forEach(room => {
        const option = document.createElement('option');
        option.value = room.number;
        option.textContent = `Ruangan ${room.number}`;
        select.appendChild(option);
    });
}

function updateReservationList() {
    const tbody = document.querySelector('#reservationList tbody');
    tbody.innerHTML = '';
    
    rooms.forEach(room => {
        room.reservations.forEach(reservation => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${reservation.name}</td>
                <td>${reservation.roomNumber}</td>
                <td>${reservation.date}</td>
                <td>${reservation.startTime}</td>
                <td>${reservation.duration} jam</td>
                <td><button onclick="cancelReservation(${room.number}, '${reservation.date}', '${reservation.startTime}')">Batalkan</button></td>
            `;
            tbody.appendChild(tr);
        });
    });
}

function cancelReservation(roomNumber, date, startTime) {
    const room = rooms.find(r => r.number === roomNumber);
    const reservation = room.reservations.find(r => 
        r.date === date && r.startTime === startTime
    );
    room.removeReservation(reservation);
    updateRoomList();
    updateReservationList();
}

// Event Listeners
document.getElementById('reservationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const roomNumber = parseInt(document.getElementById('roomNumber').value);
    const date = document.getElementById('date').value;
    const startTime = document.getElementById('startTime').value;
    const duration = parseInt(document.getElementById('duration').value);

    const room = rooms.find(r => r.number === roomNumber);
    
    if (room.isAvailable(date, startTime, duration)) {
        const reservation = new Reservation(name, roomNumber, date, startTime, duration);
        room.addReservation(reservation);
        document.getElementById('error').textContent = '';
        this.reset();
        updateRoomList();
        updateReservationList();
    } else {
        document.getElementById('error').textContent = 'Ruangan tidak tersedia pada waktu yang dipilih!';
    }
});

// Inisialisasi tampilan
updateRoomList();
updateReservationList();