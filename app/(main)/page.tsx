'use client';
import { Button, ButtonColor } from '@/shared/ui/Button';
import { Modal } from '@/shared/ui/Modal';
import { Text, TextSize, TextType } from '@/shared/ui/Text';
import { useState } from 'react';

import { redirect } from 'next/navigation';

export default function HomePage() {
	redirect('/chats');
}
