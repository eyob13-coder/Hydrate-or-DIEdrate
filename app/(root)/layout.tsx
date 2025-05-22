import { isAuthenticated } from '@/lib/actions/auth.action'
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import  { ReactNode } from 'react';

const RootLayout = async({ children}: {children: ReactNode}) => {
  const isUserAuthenthicated = await isAuthenticated();

  if(!isUserAuthenthicated)  redirect('/sign-in')
  return (
    <div className='root-layout'>
      <nav>
        <Link href="/" className='flex items-center gap-1'>
        <Image src="/logo.svg" alt='Hydrate' width={32} height={32}/>
          <h1 className="font-bold text-xl bg-gradient-to-r from-cyan-600 to-blue-800 bg-clip-text text-transparent">Hydrate</h1>

        </Link>
        </nav>
        {children}
         </div>
  )
}

export default RootLayout