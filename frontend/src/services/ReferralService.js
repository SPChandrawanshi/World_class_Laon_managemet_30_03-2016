import { mockReferrals, mockReferralRules, mockReferralRewards, mockLenders } from '../data/mockData';

class ReferralService {
  /**
   * Generates a referral link for a user
   */
  getReferralLink(referralCode) {
    const baseUrl = window.location.origin;
    return `${baseUrl}/register?ref=${referralCode}`;
  }

  /**
   * Validates a referral code
   */
  async validateReferralCode(code) {
    const referrer = mockLenders.find(l => l.referralCode === code);
    return referrer ? { isValid: true, referrerId: referrer.id } : { isValid: false };
  }

  /**
   * Checks if a referral condition is met for a lender
   */
  async checkLenderQualification(referredLenderId) {
    const referral = mockReferrals.find(r => r.referredUserId === referredLenderId && r.status === 'pending');
    if (!referral) return false;

    const activeRule = mockReferralRules.find(rule => rule.ruleType === 'lender_referral' && rule.isActive);
    if (!activeRule) return false;

    const referredLender = mockLenders.find(l => l.id === referredLenderId);
    
    if (referredLender.totalBorrowers >= activeRule.conditionValue) {
      // In a real app, this would be an API call to update the status and trigger reward
      console.log(`Referral ${referral.id} qualified! Reward: ${activeRule.rewardAmount}`);
      return true;
    }

    return false;
  }

  /**
   * Checks if a referral condition is met for a borrower (On Registration)
   */
  async checkBorrowerQualification(referredBorrowerId) {
    const referral = mockReferrals.find(r => r.referredUserId === referredBorrowerId && r.status === 'pending');
    if (!referral) return false;

    const activeRule = mockReferralRules.find(rule => rule.ruleType === 'borrower_referral' && rule.isActive);
    if (!activeRule) return false;

    // For borrowers, Case 2: Reward immediately after successful registration
    if (activeRule.conditionType === 'registration') {
      console.log(`Borrower Referral ${referral.id} qualified immediately! Reward: ${activeRule.rewardAmount}`);
      return true;
    }

    return false;
  }

  /**
   * Gets referral stats for a user
   */
  getReferralStats(userId) {
    const userReferrals = mockReferrals.filter(r => r.referrerId === userId);
    const totalReferrals = userReferrals.length;
    const qualifiedReferrals = userReferrals.filter(r => r.status === 'qualified').length;
    const pendingReferrals = userReferrals.filter(r => r.status === 'pending').length;
    
    const totalEarned = mockReferralRewards
      .filter(rew => rew.referrerId === userId)
      .reduce((sum, rew) => sum + rew.amount, 0);

    return {
      totalReferrals,
      qualifiedReferrals,
      pendingReferrals,
      totalEarned
    };
  }
}

export const referralService = new ReferralService();
