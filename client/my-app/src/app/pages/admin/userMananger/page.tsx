"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { IonIcon } from '@ionic/react';
import { lockClosedOutline, lockOpenOutline, eyeOutline } from 'ionicons/icons';
import Header from '@/app/compoments/admin/header/page';
import Navbar from '@/app/compoments/admin/navbar/page';
import "../../../styles/adminAccs.css";
import '../../../styles/adminHome.css'; // Adjust the path according to your project structure

interface Account {
  id: number;
  nameAccount: string;
  email: string;
  lock: string; // 'open' or 'lock'
}

export default function AccountManagementPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<Account[]>([]);
  const [sortOptionId, setSortOptionId] = useState<string>('default');
  const [sortOptionName, setSortOptionName] = useState<string>('default');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    axios.get<Account[]>('http://localhost:5000/userList')
      .then(response => {
        setAccounts(response.data);
        setFilteredAccounts(response.data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    const filtered = accounts.filter(account =>
      account.nameAccount.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAccounts(filtered);
  }, [searchTerm, accounts]);

  useEffect(() => {
    let sorted = [...filteredAccounts];

    if (sortOptionId === 'smallBig') {
      sorted.sort((a, b) => a.id - b.id);
    } else if (sortOptionId === 'bigSmall') {
      sorted.sort((a, b) => b.id - a.id);
    }

    if (sortOptionName === 'az') {
      sorted.sort((a, b) => a.nameAccount.localeCompare(b.nameAccount));
    } else if (sortOptionName === 'za') {
      sorted.sort((a, b) => b.nameAccount.localeCompare(a.nameAccount));
    }

    setFilteredAccounts(sorted);
  }, [sortOptionId, sortOptionName]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSortById = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOptionId(e.target.value);
  };

  const handleSortByName = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOptionName(e.target.value);
  };

  const toggleLock = (id: number) => {
    const account = accounts.find(acc => acc.id === id);
  
    if (!account) return;
  
    Swal.fire({
      title: `Bạn có chắc muốn ${account.lock === 'open' ? 'khóa' : 'mở khóa'} tài khoản này?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Có",
      cancelButtonText: "Không"
    }).then(result => {
      if (result.isConfirmed) {
        // Make the API call to update the lock status in the backend
        axios
          .put(`http://localhost:5000/userList/${id}`, {
            ...account,
            lock: account.lock === 'open' ? 'lock' : 'open'
          })
          .then(response => {
            // Update the local state only if the API call is successful
            const updatedAccounts = accounts.map(acc =>
              acc.id === id ? { ...acc, lock: acc.lock === 'open' ? 'lock' : 'open' } : acc
            );
            setAccounts(updatedAccounts);
            setFilteredAccounts(updatedAccounts);
  
            Swal.fire({
              title: `Tài khoản đã được ${updatedAccounts.find(acc => acc.id === id)?.lock === 'open' ? 'mở khóa' : 'khóa'}.`,
              icon: "success",
            });
          })
          .catch(error => {
            console.error('Error updating account lock status:', error);
            Swal.fire({
              title: 'Lỗi khi cập nhật trạng thái khóa/mở khóa!',
              icon: 'error',
            });
          });
      }
    });
  };
  

  const viewDetails = (account: Account) => {
    Swal.fire({
      title: 'Thông tin tài khoản',
      html: `
        <strong>ID:</strong> ${account.id}<br/>
        <strong>Tên tài khoản:</strong> ${account.nameAccount}<br/>
        <strong>Email:</strong> ${account.email}<br/>
        <strong>Trạng thái khóa:</strong> ${account.lock === 'open' ? 'Mở khóa' : 'Đã khóa'}
      `,
      icon: 'info'
    });
  };

  return (
    <div>
      <Header />
      <div className="container-content-admin">
        <Navbar />
        <section className="attendance">
          <div className="attendance-list">
            <h1 className="manage-title">Quản lí tài khoản</h1>
            <div className="sort-items">
              <h4>Sắp xếp theo:</h4>
              <select
                id="sort-id"
                style={{ padding: "6px 16px", backgroundColor: "lightgrey", borderRadius: 6 }}
                value={sortOptionId}
                onChange={handleSortById}
              >
                <option value="default">Mặc định - ID</option>
                <option value="smallBig">Từ nhỏ - lớn</option>
                <option value="bigSmall">Từ lớn - nhỏ</option>
              </select>
              <select
                id="sort-name"
                style={{ padding: "6px 16px", backgroundColor: "lightgrey", borderRadius: 6 }}
                value={sortOptionName}
                onChange={handleSortByName}
              >
                <option value="default">Mặc định - Tên</option>
                <option value="az">Từ A - Z</option>
                <option value="za">Từ Z - A</option>
              </select>
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm tài khoản..."
              value={searchTerm}
              onChange={handleSearchChange}
              style={{ padding: "6px 16px", marginBottom: "10px", borderRadius: 6 }}
            />
            <table className="account-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên Tài Khoản</th>
                  <th>Email</th>
                  <th>Trạng Thái Khóa</th>
                  <th>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {filteredAccounts.map(account => (
                  <tr key={account.id}>
                    <td>{account.id}</td>
                    <td>{account.nameAccount}</td>
                    <td>{account.email}</td>
                    <td>
                      {account.lock === 'open' ? (
                        <span
                          className="status-icon"
                          style={{ color: 'green', cursor: 'pointer' }}
                          onClick={() => toggleLock(account.id)}
                        >
                          <IonIcon icon={lockOpenOutline} /> Mở khóa
                        </span>
                      ) : (
                        <span
                          className="status-icon"
                          style={{ color: 'red', cursor: 'pointer' }}
                          onClick={() => toggleLock(account.id)}
                        >
                          <IonIcon icon={lockClosedOutline} /> Đã khóa
                        </span>
                      )}
                    </td>
                    <td>
                      <button onClick={() => viewDetails(account)} style={{ marginRight: '10px' }}>
                        <IonIcon icon={eyeOutline} /> Xem
                      </button>
                      <button onClick={() => toggleLock(account.id)}>
                        {account.lock === 'open' ? 'Khóa' : 'Mở khóa'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
