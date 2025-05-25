"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function Settings() {
  const [name, setName] = useState("")
  const [weight, setWeight] = useState("")
  const [height, setHeight] = useState("")
  const [restTime, setRestTime] = useState("90")

  return (
    <div className="space-y-8">
      <div className="border-b-8 border-black pb-6">
        <h1 className="text-4xl font-bold tracking-tighter mb-2">SETTINGS</h1>
        <p className="text-lg font-bold text-gray-600">PERSONALIZZA LA TUA ESPERIENZA</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-3 border-black shadow-[6px_6px_0px_0px_#000]">
          <CardHeader>
            <CardTitle className="font-bold text-xl">PROFILO</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="font-bold text-sm">NOME</label>
              <Input
                placeholder="Il tuo nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="font-bold border-2 border-black"
              />
            </div>
            <div className="space-y-2">
              <label className="font-bold text-sm">PESO (KG)</label>
              <Input
                type="number"
                placeholder="75"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="font-bold border-2 border-black"
              />
            </div>
            <div className="space-y-2">
              <label className="font-bold text-sm">ALTEZZA (CM)</label>
              <Input
                type="number"
                placeholder="175"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="font-bold border-2 border-black"
              />
            </div>
            <Button className="w-full font-bold border-2 border-black">SALVA PROFILO</Button>
          </CardContent>
        </Card>

        <Card className="border-3 border-black shadow-[6px_6px_0px_0px_#000]">
          <CardHeader>
            <CardTitle className="font-bold text-xl">PREFERENZE</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <label className="font-bold text-sm">NOTIFICHE</label>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <label className="font-bold text-sm">SUONI</label>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <label className="font-bold text-sm">VIBRAZIONE</label>
              <Switch />
            </div>
            <div className="space-y-2">
              <label className="font-bold text-sm">UNITÀ DI MISURA</label>
              <Select>
                <SelectTrigger className="border-2 border-black font-bold">
                  <SelectValue placeholder="Seleziona unità" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="metric">METRICO (KG/CM)</SelectItem>
                  <SelectItem value="imperial">IMPERIALE (LBS/IN)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="border-3 border-black shadow-[6px_6px_0px_0px_#000]">
          <CardHeader>
            <CardTitle className="font-bold text-xl">TIMER</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="font-bold text-sm">RIPOSO DEFAULT (SEC)</label>
              <Input
                type="number"
                placeholder="90"
                value={restTime}
                onChange={(e) => setRestTime(e.target.value)}
                className="font-bold border-2 border-black"
              />
            </div>
            <div className="space-y-2">
              <label className="font-bold text-sm">AVVISO TIMER</label>
              <Select>
                <SelectTrigger className="border-2 border-black font-bold">
                  <SelectValue placeholder="Seleziona avviso" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 SECONDI PRIMA</SelectItem>
                  <SelectItem value="15">15 SECONDI PRIMA</SelectItem>
                  <SelectItem value="30">30 SECONDI PRIMA</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <label className="font-bold text-sm">AUTO-START TIMER</label>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card className="border-3 border-black shadow-[6px_6px_0px_0px_#000]">
          <CardHeader>
            <CardTitle className="font-bold text-xl">DATI</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full font-bold border-2 border-black">
              ESPORTA DATI
            </Button>
            <Button variant="outline" className="w-full font-bold border-2 border-black">
              IMPORTA DATI
            </Button>
            <Button variant="destructive" className="w-full font-bold border-2 border-black">
              RESET COMPLETO
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
