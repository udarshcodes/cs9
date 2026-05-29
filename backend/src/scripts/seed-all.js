/**
 * Full seed script — populates all collections with realistic dummy data.
 * Run: node src/scripts/seed-all.js
 */

import 'dotenv/config'
import argon2 from 'argon2'
import mongoose from 'mongoose'
import connectDB from '../config/db.js'
import Role from '../models/role.model.js'
import User from '../models/user.model.js'
import UserProfile from '../models/user-profile.model.js'
import UserRoleMapper from '../models/user-role-mapper.model.js'
import Question from '../models/question.model.js'
import Answer from '../models/answer.model.js'
import Comment from '../models/comment.model.js'
import Notification from '../models/notification.model.js'
import Flag from '../models/flag.model.js'
import SparkTransaction from '../models/spark-transaction.model.js'
import { ensureRole, getMappedRoles } from '../services/role.service.js'
import { awardSpark } from '../services/spark.service.js'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function stripBody(html) {
  return html.replace(/<[^>]*>/g, '').trim()
}

// ─── Roles ────────────────────────────────────────────────────────────────────

async function seedRoles() {
  const roles = await Promise.all(['USER', 'RESOLVER', 'ADMIN'].map(ensureRole))
  console.log(`✓ Roles seeded: ${roles.map((r) => r.name).join(', ')}`)
  return roles
}

// ─── Users ────────────────────────────────────────────────────────────────────

async function seedUsers() {
  const adminRole = await ensureRole('ADMIN')
  const resolverRole = await ensureRole('RESOLVER')
  const userRole = await ensureRole('USER')

  const users = [
    {
      name: 'Portal Admin',
      email: 'admin@gmail.com',
      password: 'Admin123@',
      role: 'ADMIN',
      is_expert: false,
      spark_points: 100,
    },
    {
      name: 'Ravi Sharma',
      email: 'ravi.sharma@gmail.com',
      password: 'Resolver123@',
      role: 'RESOLVER',
      is_expert: true,
      is_verified_expert: true,
      expert_type: 'Lab Coordinator',
      specialty: 'NOC & Onboarding',
      spark_points: 85,
    },
    {
      name: 'Priya Mehta',
      email: 'priya.mehta@gmail.com',
      password: 'User1234@',
      role: 'USER',
      spark_points: 42,
    },
    {
      name: 'Arjun Nair',
      email: 'arjun.nair@gmail.com',
      password: 'User1234@',
      role: 'USER',
      spark_points: 28,
    },
    {
      name: 'Sneha Gupta',
      email: 'sneha.gupta@gmail.com',
      password: 'User1234@',
      role: 'USER',
      spark_points: 15,
    },
  ]

  const created = []
  for (const u of users) {
    const existing = await User.findOne({ email: u.email })
    if (existing) {
      console.log(`  ↹ Skipping existing user: ${u.email}`)
      created.push(existing)
      continue
    }

    const passwordHash = await argon2.hash(u.password)
    const user = await User.create({
      name: u.name,
      email: u.email,
      passwordHash,
      role: u.role,
      status: 'active',
      is_expert: u.is_expert ?? false,
      is_verified_expert: u.is_verified_expert ?? false,
      expert_type: u.expert_type ?? null,
      specialty: u.specialty ?? null,
      spark_points: u.spark_points,
    })

    // Map role
    const role = await ensureRole(u.role)
    await UserRoleMapper.create({ user_id: user.user_id, role_id: role.role_id })

    // Create profile
    await UserProfile.create({ user_id: user.user_id, display_name: user.name })

    // EXPERT_VERIFIED spark events are awarded via the awardSpark service
    // when an admin/resolver is verified — no manual transaction needed here.
    // Their spark_points are set directly above.

    console.log(`  ✓ Created user: ${u.email}`)
    created.push(user)
  }

  return created
}

// ─── FAQ Questions ────────────────────────────────────────────────────────────

async function seedFAQs(adminUser, resolverUser) {
  const faqs = [
    {
      title: 'What is the NOC deadline for the internship program?',
      body: '<p>The NOC (No Objection Certificate) must be submitted within <strong>7 days</strong> of receiving your offer letter. Failure to do so may result in your seat being offered to the waitlist candidate. Please ensure the NOC is signed by your college principal or authorized signatory and uploaded via the ViBe platform under the NOC section.</p>',
      tags: ['noc', 'deadline', 'documents'],
      slug: 'noc-deadline-internship',
      status: 'published',
      author_id: resolverUser.user_id,
    },
    {
      title: 'When does the internship start date officially begin?',
      body: '<p>The official internship start date is mentioned in your offer letter, generally the <strong>1st of the month</strong> following your selection. For example, if you are selected in June, your internship begins on <strong>1st July</strong>. Any deviation requires prior written approval from the Lab Coordinator.</p>',
      tags: ['start-date', 'timeline', 'joining'],
      slug: 'internship-start-date',
      status: 'published',
      author_id: resolverUser.user_id,
    },
    {
      title: 'How do I access the ViBe platform for daily journaling?',
      body: '<p>The ViBe platform can be accessed at <code>vibe.iitrpr.ac.in</code> using your institute email credentials. Navigate to the <strong>Rosetta Journal</strong> section to log your daily activities. Entries must be submitted by <strong>9:00 PM daily</strong> and reviewed by your assigned mentor every week.</p>',
      tags: ['vibe', 'platform', 'journal', 'rosetta'],
      slug: 'vibe-platform-access',
      status: 'published',
      author_id: resolverUser.user_id,
    },
    {
      title: 'What is the selection process for the internship?',
      body: '<p>The selection process consists of three stages: <ol><li>Application screening (GPA + statement of purpose)</li><li>Technical interview (online via Google Meet)</li><li>Final offer roll-out via email within 48 hours of the interview</li></ol>Shortlisted candidates are notified 1 week before the interview date.</p>',
      tags: ['selection', 'interview', 'process'],
      slug: 'selection-process',
      status: 'published',
      author_id: resolverUser.user_id,
    },
    {
      title: 'How do I claim my internship completion certificate?',
      body: '<p>Upon successful completion of the internship (minimum 8 weeks, all journal entries submitted, NOC submitted), your certificate is auto-generated from the <strong>ViBe platform</strong> under the <em>Certificates</em> tab. Processing takes <strong>5–7 working days</strong> after your last day.</p>',
      tags: ['certificate', 'completion', 'internship'],
      slug: 'completion-certificate',
      status: 'published',
      author_id: resolverUser.user_id,
    },
  ]

  const created = []
  for (const faq of faqs) {
    const existing = await Question.findOne({ slug: faq.slug })
    if (existing) {
      console.log(`  ↹ Skipping existing FAQ: ${faq.slug}`)
      created.push(existing)
      continue
    }

    const question = await Question.create({
      ...faq,
      kind: 'faq',
      body_plain: stripBody(faq.body),
      moderation_status: 'approved',
      upvotes: Math.floor(Math.random() * 50) + 10,
      view_count: Math.floor(Math.random() * 200) + 20,
      answer_count: 1,
      has_expert_answer: true,
      last_activity_at: new Date(),
    })

    // Each FAQ gets exactly one canonical answer
    const answerBody = `<p>This is the official answer verified by the Lab Coordinator. For further assistance, please contact the support team via the <strong>Lab Support</strong> channel on the platform.</p>`
    const answer = await Answer.create({
      question_id: question.question_id,
      question_kind: 'faq',
      author_id: resolverUser.user_id,
      author_role: 'RESOLVER',
      body: answerBody,
      body_plain: stripBody(answerBody),
      is_expert: true,
      is_official: true,
      is_accepted: true,
      upvotes: Math.floor(Math.random() * 30) + 5,
      score: Math.floor(Math.random() * 30) + 5,
      moderation_status: 'approved',
    })

    console.log(`  ✓ Created FAQ: ${question.slug}`)
    created.push(question)
  }

  return created
}

// ─── Discussion Questions ─────────────────────────────────────────────────────

async function seedDiscussions(users) {
  const discussions = [
    {
      title: 'Can I delay my joining date by 2 weeks due to college exams?',
      body: '<p>My college end-semester exams are scheduled until the 15th of July. My offer letter says joining on 1st July. Is it possible to request a delayed joining? Will this affect my selection status?</p>',
      tags: ['joining', 'exams', 'delay'],
      author_id: users[2].user_id, // Priya
      spark_bounty: 20,
    },
    {
      title: 'My NOC is signed by the Dean — will that be accepted?',
      body: '<p>My college doesn\'t have a designated principal at the moment. The Dean has signed my NOC. Is this acceptable or do I need to get it re-signed by an authorized principal?</p>',
      tags: ['noc', 'document', 'dean'],
      author_id: users[3].user_id, // Arjun
      spark_bounty: 0,
    },
    {
      title: 'ViBe platform login not working — getting 403 error',
      body: '<p>I\'ve been trying to log into the ViBe platform since morning but I keep getting a 403 Forbidden error. I\'ve reset my password twice. Is there a known outage? My institute email is arjun.nair@student.iitrpr.ac.in</p>',
      tags: ['vibe', 'login', 'error', 'platform'],
      author_id: users[3].user_id, // Arjun
      spark_bounty: 10,
    },
    {
      title: 'How should team formation be done for group projects?',
      body: '<p>Are teams formed by the coordinators or do we need to form our own teams? If we form our own, what is the maximum team size? Also, is cross-discipline teaming allowed?</p>',
      tags: ['team', 'project', 'team-formation'],
      author_id: users[4].user_id, // Sneha
      spark_bounty: 0,
    },
    {
      title: 'Can I convert from part-time to full-time internship mid-way?',
      body: '<p>I initially selected part-time because of my coursework load. Now I realize I can manage full-time. Is it possible to convert mid-way? What is the process?</p>',
      tags: ['part-time', 'full-time', 'conversion'],
      author_id: users[2].user_id, // Priya
      spark_bounty: 15,
    },
  ]

  const resolverUser = users[1] // Ravi (resolver)
  const created = []
  for (const disc of discussions) {
    const question = await Question.create({
      ...disc,
      kind: 'community',
      body_plain: stripBody(disc.body),
      moderation_status: 'approved',
      status: 'unanswered',
      upvotes: Math.floor(Math.random() * 10),
      view_count: Math.floor(Math.random() * 50) + 5,
      answer_count: 0,
    })

    // Reserve bounty if any
    if (disc.spark_bounty > 0) {
      await SparkTransaction.create({
        user_id: disc.author_id,
        action: 'QUESTION_BOUNTY',
        points: -disc.spark_bounty,
        reference_id: question.question_id,
        reference_type: 'question',
      })
    }

    console.log(`  ✓ Created discussion: ${question.title.slice(0, 40)}...`)
    created.push({ question, discussion: disc })
  }

  return created
}

// ─── Answers ──────────────────────────────────────────────────────────────────

async function seedAnswers(faqs, discussions, users) {
  // Answer to NOC delay question — answered by resolver (users[1])
  const delayQuestion = discussions[0].question
  const resolverUser = users[1] // Ravi Sharma (RESOLVER)

  const answerBody1 = `<p>Yes, a delayed joining of up to <strong>2 weeks</strong> can be granted under exceptional circumstances including ongoing examinations. You need to:</p>
<ol><li>Submit a formal delay request via the ViBe platform before the joining date</li><li>Attach a scanned copy of your exam timetable as supporting document</li><li>Wait for approval from the Lab Coordinator (usually within 48 hours)</li></ol>
<p>Please note that delays beyond 2 weeks may require fresh approval from the program director.</p>`

  const answer1 = await Answer.create({
    question_id: delayQuestion.question_id,
    question_kind: 'community',
    author_id: resolverUser.user_id,
    author_role: 'RESOLVER',
    body: answerBody1,
    body_plain: stripBody(answerBody1),
    is_expert: true,
    upvotes: 8,
    score: 8,
    moderation_status: 'approved',
  })

  // Update question
  await Question.updateOne(
    { question_id: delayQuestion.question_id },
    {
      $set: { status: 'answered', answer_count: 1, has_expert_answer: true },
      $inc: { upvotes: 3 },
    },
  )

  // Award spark
  await SparkTransaction.create({
    user_id: resolverUser.user_id,
    action: 'SUBMIT_ANSWER',
    points: 5,
    reference_id: answer1.answer_id,
    reference_type: 'answer',
  })

  console.log(`  ✓ Created answer for discussion`)

  return [answer1]
}

// ─── Comments ─────────────────────────────────────────────────────────────────

async function seedComments(answer, users) {
  const askerUser = users[2] // Priya Mehta (the user who asked the question)
  const resolverUser = users[1] // Ravi Sharma (RESOLVER)

  const comments = [
    {
      question_id: answer.question_id,
      answer_id: answer.answer_id,
      author_id: askerUser.user_id,
      author_role: 'USER',
      body: 'Thank you! I have already submitted my exam timetable. Hope it gets approved quickly.',
      depth: 0,
    },
    {
      question_id: answer.question_id,
      answer_id: answer.answer_id,
      author_id: resolverUser.user_id,
      author_role: 'RESOLVER',
      body: '@user Check your ViBe dashboard — approval usually comes within 24 hours during exam period.',
      depth: 1,
      parent_id: null, // set after first comment is created below
    },
  ]

  // Create first comment
  const comment1 = await Comment.create({
    ...comments[0],
    body_plain: stripBody(comments[0].body),
    moderation_status: 'approved',
  })

  // Create second comment as reply to first
  const comment2 = await Comment.create({
    ...comments[1],
    root_comment_id: comment1.comment_id,
    parent_id: comment1.comment_id,
    body_plain: stripBody(comments[1].body),
    moderation_status: 'approved',
  })

  // Update reply counts
  await Comment.updateOne({ comment_id: comment1.comment_id }, { $set: { reply_count: 1 } })

  // Update answer comment count
  await Answer.updateOne(
    { answer_id: answer.answer_id },
    { $set: { comment_count: 2, top_level_comment_count: 1 } },
  )

  console.log(`  ✓ Created 2 comments`)
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🔱 Rogāre — Full Seed Script\n')

  try {
    await connectDB()

    // 1. Seed roles
    console.log('\n📦 Seeding roles...')
    const roles = await seedRoles()

    // 2. Seed users
    console.log('\n📦 Seeding users...')
    const users = await seedUsers()
    const adminUser = users[0]
    const resolverUser = users[1]

    // 3. Seed FAQs
    console.log('\n📦 Seeding FAQs...')
    const faqs = await seedFAQs(adminUser, resolverUser)

    // 4. Seed Discussions
    console.log('\n📦 Seeding Discussions...')
    const discussions = await seedDiscussions(users)

    // 5. Seed Answers
    console.log('\n📦 Seeding Answers...')
    const answers = await seedAnswers(faqs, discussions, users)

    // 6. Seed Comments
    console.log('\n📦 Seeding Comments...')
    if (answers[0]) {
      await seedComments(answers[0], users)
    }

    // 7. Summary
    console.log('\n✅ Seed complete!\n')
    console.log('Admin login:')
    console.log('  Email:    admin@gmail.com')
    console.log('  Password: Admin123@\n')

    console.log('Other test accounts:')
    console.log('  Resolver: ravi.sharma@gmail.com / Resolver123@')
    console.log('  User:     priya.mehta@gmail.com / User1234@\n')
  } catch (err) {
    console.error('\n❌ Seed failed:', err.message)
    console.error(err.stack)
    process.exit(1)
  } finally {
    await mongoose.disconnect()
  }
}

main()
