const bcrypt = require('bcryptjs');
const { Student, Faculty } = require('./models');

async function fixAllPasswords() {
  try {
    console.log('🔧 Fixing all test user passwords...');
    const newHash = await bcrypt.hash('demo123', 10);
    
    await Student.update({ password: newHash }, { where: {} });
    await Faculty.update({ password: newHash }, { where: {} });
    
    console.log('✅ All user passwords updated to "demo123"');
    console.log('\n📝 Test Credentials:');
    console.log('👑 Admin: admin@jecrc.ac.in / admin123');
    console.log('👨‍🎓 Student: alice.johnson.cse25004@jecrc.edu / demo123');
    console.log('👩‍🏫 Faculty: jane.smith@jecrc.edu / demo123');
    console.log('\n🚀 You can now login to both student and faculty portals!');
    
    process.exit(0);
  } catch(e) {
    console.error('❌ Error:', e.message);
    process.exit(1);
  }
}

fixAllPasswords();