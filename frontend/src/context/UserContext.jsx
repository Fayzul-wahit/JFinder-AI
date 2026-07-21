import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState({});
  const [crs, setCrs] = useState(null);
  const [roadmap, setRoadmap] = useState([]);
  const [skillGap, setSkillGap] = useState([]);

  const updateProfile = (data) => {
    setUserProfile(prev => ({ ...prev, ...data }));
  };

  const refreshData = async () => {
    // API calls to refresh context state would go here
    console.log('Refreshing user data');
  };

  return (
    <UserContext.Provider value={{ userProfile, crs, roadmap, skillGap, updateProfile, refreshData }}>
      {children}
    </UserContext.Provider>
  );
};
