import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import useAuthStore from '@/store/useAuthStore';
import api from '@/services/api';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, loading: authLoading } = useAuthStore();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    headline: '',
    bio: '',
    company_name: '',
    company_website: '',
    company_size: '',
    industry: '',
    location: '',
    skills: [],
    experience: [],
    education: [],
    avatar_url: '',
    role: 'jobseeker'
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        console.log('Fetching profile for user:', user.id);
        let data = await api.profiles.getById(user.id);
        
        // If profile doesn't exist, create one
        if (!data) {
          console.log('Creating new profile for user:', user.id);
          const isAdmin = user.email === 'admin@jobmatch.com';
          data = await api.profiles.create(user.id, {
            full_name: user.user_metadata?.full_name || '',
            email: user.email,
            phone: '',
            headline: '',
            bio: '',
            company_name: '',
            company_website: '',
            company_size: '',
            industry: '',
            location: '',
            skills: [],
            experience: [],
            education: [],
            avatar_url: '',
            role: isAdmin ? 'admin' : 'jobseeker'
          });
        }

        console.log('Profile data:', data);
        if (data) {
          setProfile(data);
          setFormData({
            full_name: data.full_name || '',
            email: data.email || user.email,
            phone: data.phone || '',
            headline: data.headline || '',
            bio: data.bio || '',
            company_name: data.company_name || '',
            company_website: data.company_website || '',
            company_size: data.company_size || '',
            industry: data.industry || '',
            location: data.location || '',
            skills: data.skills || [],
            experience: data.experience || [],
            education: data.education || [],
            avatar_url: data.avatar_url || '',
            role: data.role || 'jobseeker'
          });
        }
      } catch (error) {
        console.error('Error fetching/creating profile:', error);
        if (!profile) {
          setProfile(null);
        }
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchProfile();
    }
  }, [user, authLoading]);

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

  const renderProfileForm = () => {
    switch (profile.role) {
      case 'admin':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                disabled={!editing}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                disabled
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <input
                type="text"
                value="Administrator"
                className="w-full p-2 border rounded-md"
                disabled
              />
            </div>
          </div>
        );

      case 'employer':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                disabled={!editing}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Company Name</label>
              <input
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                disabled={!editing}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Company Website</label>
              <input
                type="url"
                name="company_website"
                value={formData.company_website}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                disabled={!editing}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Company Size</label>
              <select
                name="company_size"
                value={formData.company_size}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                disabled={!editing}
              >
                <option value="">Select company size</option>
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-500">201-500 employees</option>
                <option value="501-1000">501-1000 employees</option>
                <option value="1001+">1001+ employees</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Industry</label>
              <input
                type="text"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                disabled={!editing}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                disabled={!editing}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Contact Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                disabled={!editing}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                disabled={!editing}
              />
            </div>
          </div>
        );

      default: // jobseeker
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                disabled={!editing}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                disabled={!editing}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                disabled={!editing}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Professional Headline</label>
              <input
                type="text"
                name="headline"
                value={formData.headline}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                disabled={!editing}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                className="w-full p-2 border rounded-md"
                disabled={!editing}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Skills</label>
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  const renderProfileView = () => {
    switch (profile.role) {
      case 'admin':
        return (
          <div className="space-y-6">
            <div className="bg-card p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold">{profile.full_name}</h2>
              <p className="text-muted-foreground">{profile.email}</p>
              <p className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                Administrator
              </p>
            </div>
          </div>
        );

      case 'employer':
        return (
          <div className="space-y-6">
            <div className="bg-card p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold">{profile.company_name}</h2>
              <p className="text-lg text-primary-600">{profile.industry}</p>
              <p className="text-muted-foreground">{profile.location}</p>
              
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Company Size</p>
                  <p className="text-muted-foreground">{profile.company_size}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Website</p>
                  <a href={profile.company_website} target="_blank" rel="noopener noreferrer" 
                     className="text-primary-600 hover:underline">
                    {profile.company_website}
                  </a>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm font-medium">Contact Information</p>
                <p className="text-muted-foreground">{profile.full_name}</p>
                <p className="text-muted-foreground">{profile.email}</p>
                <p className="text-muted-foreground">{profile.phone}</p>
              </div>
            </div>
          </div>
        );

      default: // jobseeker
        return (
          <div className="space-y-6">
            <div className="bg-card p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold">{profile.full_name}</h2>
              <p className="text-muted-foreground">{profile.headline}</p>
              <p className="mt-4">{profile.bio}</p>

              {profile.skills?.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6">
                <p className="text-sm font-medium">Contact Information</p>
                <p className="text-muted-foreground">{profile.email}</p>
                <p className="text-muted-foreground">{profile.phone}</p>
              </div>
            </div>
          </div>
        );
    }
  };

  // Show loading while auth state is being determined
  if (authLoading || loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-32" />
          </div>
          
          <div className="space-y-6">
            <div className="space-y-4">
              <Skeleton className="h-24 w-full" /> {/* Avatar area */}
            </div>
            
            <div className="space-y-4">
              <Skeleton className="h-6 w-3/4" /> {/* Name */}
              <Skeleton className="h-4 w-1/2" /> {/* Title */}
              <div className="space-y-2">
                <Skeleton className="h-20 w-full" /> {/* Bio */}
              </div>
            </div>

            <div className="space-y-4">
              <Skeleton className="h-6 w-32" /> {/* Section title */}
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-8 w-24" /> /* Skills */
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show sign in message if no user
  if (!user) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-semibold mb-4">Please sign in to view your profile</h2>
          <Button onClick={() => navigate('/login')}>Sign In</Button>
        </div>
      </div>
    );
  }

  // Show error message if profile couldn't be loaded
  if (!profile) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-semibold mb-4">Error loading profile</h2>
          <p className="text-gray-600 mb-4">There was a problem loading your profile. Please try again later.</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
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
            {renderProfileForm()}
            <Button type="submit">Save Changes</Button>
          </form>
        ) : (
          renderProfileView()
        )}
      </div>
    </div>
  );
};

export default Profile;
