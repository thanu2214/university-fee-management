import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/studentService';
import { formatDate } from '../../utils/formatters';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { User, Mail, Phone, MapPin, Building, GraduationCap, Calendar, Shield } from 'lucide-react';

export const StudentProfilePage = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await studentService.getMyProfile();
        setStudent(data);
      } catch (err) {
        console.error('Error fetching student profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading student profile details..." />;
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Student Profile & Academic Records</h1>
          <p className="page-header-desc">
            Personal identity particulars, enrolled academic degree, and departmental registration.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        {/* Personal Details Card */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Personal & Contact Particulars</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <User size={18} style={{ color: 'var(--accent)' }} />
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Full Name</div>
                <div style={{ fontWeight: 600 }}>{student?.fullName}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Mail size={18} style={{ color: 'var(--accent)' }} />
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Official University Email</div>
                <div style={{ fontWeight: 600 }}>{student?.email}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Phone size={18} style={{ color: 'var(--accent)' }} />
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Contact Phone</div>
                <div style={{ fontWeight: 600 }}>{student?.phone || '—'}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <MapPin size={18} style={{ color: 'var(--accent)' }} />
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Residential Address</div>
                <div style={{ fontWeight: 600 }}>{student?.address || '—'}</div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Parent / Guardian</div>
              <div style={{ fontWeight: 600 }}>{student?.guardianName} ({student?.guardianPhone})</div>
            </div>
          </div>
        </div>

        {/* Academic Details Card */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Enrolled Academic Degree</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <GraduationCap size={18} style={{ color: 'var(--primary)' }} />
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Degree Program</div>
                <div style={{ fontWeight: 600, color: 'var(--primary)' }}>{student?.program}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Building size={18} style={{ color: 'var(--primary)' }} />
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Faculty / School</div>
                <div style={{ fontWeight: 600 }}>{student?.department}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Roll Number</div>
                <div style={{ fontWeight: 700, color: 'var(--accent)' }}>{student?.rollNumber}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Registration ID</div>
                <div style={{ fontWeight: 600 }}>{student?.registrationNo}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Current Semester</div>
                <div style={{ fontWeight: 600 }}>Semester {student?.currentSemester}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Academic Session</div>
                <div style={{ fontWeight: 600 }}>{student?.academicYear}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
              <Calendar size={18} style={{ color: 'var(--text-muted)' }} />
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Admission Date</div>
                <div style={{ fontWeight: 600 }}>{formatDate(student?.admissionDate)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfilePage;
