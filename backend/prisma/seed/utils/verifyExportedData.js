async function verifyExportedData() {
  console.log('🔍 Verificando datos exportados...')

  const requiredFiles = ['questions.json', 'metadata.json']
  const exportDir = path.join(__dirname, '..', 'data', 'exported')

  try {
    for (const file of requiredFiles) {
      const filePath = path.join(exportDir, file)
      const stats = await fs.stat(filePath)
      console.log(`✅ ${file} - ${(stats.size / 1024).toFixed(2)} KB`)
    }

    const metadata = JSON.parse(
      await fs.readFile(path.join(exportDir, 'metadata.json'), 'utf8')
    )
    console.log(`📅 Datos exportados el: ${metadata.exportDate}`)
    console.log('🎯 Archivos listos para transportar')
  } catch (error) {
    console.error('❌ Error verificando archivos:', error.message)
    console.log('💡 Ejecuta el exportador primero.')
  }
}
