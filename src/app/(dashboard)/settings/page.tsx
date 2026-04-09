'use client'

import React from 'react'
import { Header } from '@/components/layout/header'
import { Card, CardBody, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'

export default function SettingsPage() {
  return (
    <>
      <Header title="Settings" notificationCount={0} />
      <div className="space-y-6 px-6 py-8">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Workspace Settings</h2>
          <p className="text-sm text-slate-600">Manage your account and preferences</p>
        </div>

        <Tabs defaultValue="workspace" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 border-b border-slate-200">
            <TabsTrigger value="workspace">Workspace</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="workspace" className="space-y-4">
            <Card>
              <CardHeader>
                <h3 className="font-semibold">Company Information</h3>
              </CardHeader>
              <CardBody className="space-y-4">
                <Input label="Company Name" placeholder="Acme Manufacturing" />
                <Input label="Industry" placeholder="Manufacturing" />
                <Input label="Timezone" placeholder="Asia/Kolkata" />
                <Button>Save Changes</Button>
              </CardBody>
            </Card>
          </TabsContent>

          <TabsContent value="team" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Team Members</h3>
                  <Button size="sm">Invite Member</Button>
                </div>
              </CardHeader>
              <CardBody>
                <p className="text-sm text-slate-600">No team members yet</p>
              </CardBody>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="space-y-4">
            <Card>
              <CardHeader>
                <h3 className="font-semibold">Current Plan</h3>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Starter Plan</p>
                    <p className="text-sm text-slate-600">Up to 10 vendors</p>
                  </div>
                  <Button>Upgrade</Button>
                </div>
              </CardBody>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <h3 className="font-semibold">Notification Preferences</h3>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Contract Expiry Alerts</p>
                    <p className="text-sm text-slate-600">Notify when contracts expire</p>
                  </div>
                  <input type="checkbox" defaultChecked />
                </div>
                <div className="flex items-center justify-between border-t pt-4">
                  <div>
                    <p className="font-medium">Invoice Due Alerts</p>
                    <p className="text-sm text-slate-600">Notify about due invoices</p>
                  </div>
                  <input type="checkbox" defaultChecked />
                </div>
              </CardBody>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
