

export const isUserInEligibilityGroup = (userId, privilegeGroups, eligibilityGroupId) => {
  if (!userId || !privilegeGroups || !eligibilityGroupId) return false;
  
  const group = privilegeGroups.find(g => g._id === eligibilityGroupId);
  if (!group) return false;
  
  // Check if user is in activeGroupMembers or groupMembers
  const isActive = group.activeGroupMembers?.some(member => 
    member === userId || member._id === userId
  );
  
  const isMember = group.groupMembers?.some(member => 
    member === userId || member._id === userId
  );
  
  return isActive || isMember;
};


export const getKRRewardPoints = ({ userId, rewardSchemes, privilegeGroups }) => {
  try {
    // Find applicable reward scheme for the user
    const applicableScheme = rewardSchemes?.find(scheme => {
      // Check if scheme has KR achievement configuration
      if (!scheme.krAchievementPoints) {
        return false;
      }
      
      // Check if user is in the eligibility group
      if (scheme.eligibilityGroup) {
        return isUserInEligibilityGroup(userId, privilegeGroups, scheme.eligibilityGroup);
      }
      
      // If no eligibility group specified, apply to all
      return true;
    });
    
    // Return configured reward points and approval status
    if (applicableScheme && applicableScheme.krAchievementPoints) {
      return {
        points: Number(applicableScheme.krAchievementPoints) || 0,
        approvalRequired: applicableScheme.approvalRequired || false
      };
    }
    
    return {
      points: 0,
      approvalRequired: false
    };
  } catch (error) {
    console.error('Error calculating KR reward points:', error);
    return {
      points: 0,
      approvalRequired: false
    };
  }
};


export const getObjectiveRewardPoints = ({ userId, rewardSchemes, privilegeGroups }) => {
  try {
    // Find applicable reward scheme for the user
    const applicableScheme = rewardSchemes?.find(scheme => {
      // Check if scheme has Objective achievement configuration
      if (!scheme.objectivesAchievementPoints) {
        return false;
      }
      
      // Check if user is in the eligibility group
      if (scheme.eligibilityGroup) {
        return isUserInEligibilityGroup(userId, privilegeGroups, scheme.eligibilityGroup);
      }
      
      // If no eligibility group specified, apply to all
      return true;
    });
    
    // Return configured reward points and approval status
    if (applicableScheme && applicableScheme.objectivesAchievementPoints) {
      return {
        points: Number(applicableScheme.objectivesAchievementPoints) || 0,
        approvalRequired: applicableScheme.approvalRequired || false
      };
    }
    
    return {
      points: 0,
      approvalRequired: false
    };
  } catch (error) {
    console.error('Error calculating Objective reward points:', error);
    return {
      points: 0,
      approvalRequired: false
    };
  }
};


export const getTaskRewardPoints = ({ userId, rewardSchemes, privilegeGroups }) => {
  try {
    // Find applicable reward scheme for the user
    const applicableScheme = rewardSchemes?.find(scheme => {
      // Check if scheme has Task achievement configuration
      if (!scheme.taskAchievementPoints) {
        return false;
      }
      
      // Check if user is in the eligibility group
      if (scheme.eligibilityGroup) {
        return isUserInEligibilityGroup(userId, privilegeGroups, scheme.eligibilityGroup);
      }
      
      // If no eligibility group specified, apply to all
      return true;
    });
    
    // Return configured reward points and approval status
    if (applicableScheme && applicableScheme.taskAchievementPoints) {
      return {
        points: Number(applicableScheme.taskAchievementPoints) || 0,
        approvalRequired: applicableScheme.approvalRequired || false
      };
    }
    
    return {
      points: 0,
      approvalRequired: false
    };
  } catch (error) {
    console.error('Error calculating Task reward points:', error);
    return {
      points: 0,
      approvalRequired: false
    };
  }
};


export const getSubTaskRewardPoints = ({ userId, rewardSchemes, privilegeGroups }) => {
  try {
    // Find applicable reward scheme for the user
    const applicableScheme = rewardSchemes?.find(scheme => {
      // Check if scheme has SubTask achievement configuration
      if (!scheme.subTaskAchievementPoints) {
        return false;
      }
      
      // Check if user is in the eligibility group
      if (scheme.eligibilityGroup) {
        return isUserInEligibilityGroup(userId, privilegeGroups, scheme.eligibilityGroup);
      }
      
      // If no eligibility group specified, apply to all
      return true;
    });
    
    // Return configured reward points and approval status
    if (applicableScheme && applicableScheme.subTaskAchievementPoints) {
      return {
        points: Number(applicableScheme.subTaskAchievementPoints) || 0,
        approvalRequired: applicableScheme.approvalRequired || false
      };
    }
    
    return {
      points: 0,
      approvalRequired: false
    };
  } catch (error) {
    console.error('Error calculating SubTask reward points:', error);
    return {
      points: 0,
      approvalRequired: false
    };
  }
};

