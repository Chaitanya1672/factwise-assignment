import Image from 'next/image'
import UserList from '../components/users/UserList'
import { USER_MANAGEMENT } from '@/constants/strings'

export default function Home() {
  return (
    <main>
      <h1 className="header-tag">{USER_MANAGEMENT}</h1>
      <UserList />
    </main>
  )
}
