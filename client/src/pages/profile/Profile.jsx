import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import useAuthStore from '@/store/useAuthStore';
import api from '@/services/api';

const Profile = () => {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    title: '',
    bio: '',
    skills: [],
    experience: [],
    education: [],
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api.profiles.getById(user.id);
        setProfile(data);
        setFormData({
          full_name: data.full_name || '',
          title: data.title || '',
          bio: data.bio || '',
          skills: data.skills || [],
          experience: data.experience || [],
          education: data.education || [],
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSkillsChange = (e) => {
    const skills = e.target.value.split(',').map(skill => skill.trim());
    setFormData(prev => ({
      ...prev,
      skills,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedProfile = await api.profiles.update(user.id, formData);
      setProfile(updatedProfile);
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (loading) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Profile</h1>
          <Button
            onClick={() => setEditing(!editing)}
            variant="outline"
          >
            {editing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </div>

        {editing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                placeholder="e.g., Senior Software Engineer"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Skills (comma-separated)</label>
              <input
                type="text"
                value={formData.skills.join(', ')}
                onChange={handleSkillsChange}
                className="w-full p-2 border rounded-md"
                placeholder="e.g., React, JavaScript, Node.js"
              />
            </div>

            <Button type="submit">Save Changes</Button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="bg-card p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold">{profile.full_name}</h2>
              <p className="text-muted-foreground">{profile.title}</p>
              <p className="mt-4">{profile.bio}</p>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills?.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-secondary rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Add sections for experience and education here */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
