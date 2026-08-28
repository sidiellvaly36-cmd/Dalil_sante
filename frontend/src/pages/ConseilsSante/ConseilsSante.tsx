import { useState } from 'react'
import { App, Form, Input, Progress, Select, Switch, Typography, Upload } from 'antd'
import type { UploadProps } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  CloseCircleOutlined,
  FilePdfOutlined,
  InboxOutlined,
} from '@ant-design/icons'
import { DataTable, FormDrawer, PageHeader } from '@/components'
import { useConfirmDelete } from '@/hooks/useConfirmDelete'
import {
  useConseilsSanteQuery,
  useCreateConseil,
  useDeleteConseil,
  useUpdateConseil,
} from '@/hooks/useConseilsSante'
import { useEtablissementsQuery } from '@/hooks/useEtablissements'
import { getConseilsSanteColumns } from './columns'
import { conseilSanteFormSchema, type ConseilSanteFormValues } from './conseilSanteFormSchema'
import { CATEGORIE_CONSEIL_OPTIONS } from '@/constants'
import type { ConseilSante, ConseilSantePayload } from '@/types'
import styles from './ConseilsSante.module.scss'

const { Text } = Typography
const { Dragger } = Upload

const emptyValues: ConseilSanteFormValues = {
  titre: '',
  categorie: null,
  publie: false,
  etablissementId: null,
}

const MAX_PDF_SIZE_MB = 10

function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} Ko`
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`
}

/**
 * Gestion des Conseils de santé (espace ADMIN) - CRUD réel sur
 * /api/conseils-sante. Chaque conseil est désormais construit à partir d'un
 * vrai fichier PDF uploadé (multipart/form-data, stockage disque côté
 * Backend - jamais de Mock Data ni de Base64) au lieu d'un texte saisi
 * manuellement. Le champ "contenu" historique n'est plus proposé dans ce
 * formulaire, mais reste préservé côté Backend pour les anciens conseils.
 */
function ConseilsSante() {
  const { message } = App.useApp()
  const { data, isLoading } = useConseilsSanteQuery()
  const { data: etablissements } = useEtablissementsQuery()
  const { mutate: createConseil, isPending: isCreating } = useCreateConseil()
  const { mutate: updateConseil, isPending: isUpdating } = useUpdateConseil()
  const { mutate: deleteConseil } = useDeleteConseil()
  const confirmDelete = useConfirmDelete()

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingConseil, setEditingConseil] = useState<ConseilSante | null>(null)
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  const isEditMode = editingConseil !== null
  const isSaving = isCreating || isUpdating

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ConseilSanteFormValues>({
    resolver: zodResolver(conseilSanteFormSchema),
    defaultValues: emptyValues,
  })

  const openCreateDrawer = () => {
    setEditingConseil(null)
    setPdfFile(null)
    setUploadProgress(null)
    reset(emptyValues)
    setDrawerOpen(true)
  }

  const openEditDrawer = (record: ConseilSante) => {
    setEditingConseil(record)
    setPdfFile(null)
    setUploadProgress(null)
    reset({
      titre: record.titre,
      categorie: record.categorie,
      publie: record.publie,
      etablissementId: record.etablissementId,
    })
    setDrawerOpen(true)
  }

  const closeDrawer = () => {
    setDrawerOpen(false)
    setEditingConseil(null)
    setPdfFile(null)
    setUploadProgress(null)
  }

  const validatePdfFile = (file: File): boolean => {
    const isPdfType = file.type === 'application/pdf'
    const isPdfExtension = file.name.toLowerCase().endsWith('.pdf')

    if (!isPdfType || !isPdfExtension) {
      message.error('Seuls les fichiers PDF (.pdf) sont autorisés.')
      return false
    }

    if (file.size > MAX_PDF_SIZE_MB * 1024 * 1024) {
      message.error(`Le fichier PDF ne doit pas dépasser ${MAX_PDF_SIZE_MB} Mo.`)
      return false
    }

    return true
  }

  const draggerProps: UploadProps = {
    accept: '.pdf,application/pdf',
    multiple: false,
    showUploadList: false,
    disabled: isSaving,
    beforeUpload: (file) => {
      const rawFile = file as unknown as File
      if (validatePdfFile(rawFile)) {
        setPdfFile(rawFile)
      }
      return false
    },
  }

  const onSubmit = (values: ConseilSanteFormValues) => {
    if (!isEditMode && !pdfFile) {
      message.error('Le fichier PDF est obligatoire.')
      return
    }

    const payload: ConseilSantePayload = { ...values, contenu: null }
    setUploadProgress(0)

    if (isEditMode && editingConseil) {
      updateConseil(
        { id: editingConseil.id, payload, pdf: pdfFile, onProgress: setUploadProgress },
        { onSuccess: closeDrawer },
      )
      return
    }

    createConseil(
      { payload, pdf: pdfFile as File, onProgress: setUploadProgress },
      { onSuccess: closeDrawer },
    )
  }

  const handleDelete = (record: ConseilSante) => {
    confirmDelete({
      title: `Supprimer le conseil "${record.titre}" ?`,
      content: 'Cette action est irréversible et supprimera également son fichier PDF.',
      onConfirm: () => deleteConseil(record.id),
    })
  }

  const handleTogglePublish = (record: ConseilSante) => {
    const payload: ConseilSantePayload = {
      titre: record.titre,
      contenu: record.contenu,
      categorie: record.categorie,
      publie: !record.publie,
      etablissementId: record.etablissementId,
    }
    updateConseil({ id: record.id, payload })
  }

  const columns = getConseilsSanteColumns({
    onEdit: openEditDrawer,
    onDelete: handleDelete,
    onTogglePublish: handleTogglePublish,
  })

  return (
    <div>
      <PageHeader
        title="Conseils de santé"
        subtitle="Publiez des conseils de santé sous forme de documents PDF réels."
        actionLabel="Ajouter un conseil"
        onAction={openCreateDrawer}
      />

      <DataTable<ConseilSante>
        columns={columns}
        data={data ?? []}
        loading={isLoading}
        rowKey="id"
        searchableFields={['titre']}
        searchPlaceholder="Rechercher un conseil..."
        emptyDescription="Aucun conseil de santé trouvé"
      />

      <FormDrawer
        title={isEditMode ? 'Modifier le conseil' : 'Ajouter un conseil de santé'}
        open={drawerOpen}
        onClose={closeDrawer}
        onSubmit={handleSubmit(onSubmit)}
        loading={isSaving}
        submitLabel={isEditMode ? 'Enregistrer' : 'Créer'}
      >
        <Form layout="vertical">
          <Form.Item label="Titre" validateStatus={errors.titre ? 'error' : ''} help={errors.titre?.message}>
            <Controller
              name="titre"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Vaccination infantile" />}
            />
          </Form.Item>

          <Form.Item label="Catégorie">
            <Controller
              name="categorie"
              control={control}
              render={({ field }) => (
                <Select
                  allowClear
                  value={field.value ?? undefined}
                  onChange={(value) => field.onChange(value ?? null)}
                  options={CATEGORIE_CONSEIL_OPTIONS}
                  placeholder="Sélectionnez une catégorie (optionnel)"
                />
              )}
            />
          </Form.Item>

          <Form.Item label="Établissement de santé (optionnel)">
            <Controller
              name="etablissementId"
              control={control}
              render={({ field }) => (
                <Select
                  allowClear
                  value={field.value ?? undefined}
                  onChange={(value) => field.onChange(value ?? null)}
                  options={etablissements?.map((etablissement) => ({
                    value: etablissement.id,
                    label: etablissement.nom,
                  }))}
                  placeholder="Conseil général (aucun établissement)"
                />
              )}
            />
          </Form.Item>

          <Form.Item label="Document PDF" required={!isEditMode}>
            {isEditMode && editingConseil?.pdfFileName && !pdfFile && (
              <div className={styles.currentFile}>
                <FilePdfOutlined /> Fichier actuel : <Text strong>{editingConseil.pdfFileName}</Text>
                <Text type="secondary"> (sélectionnez un nouveau fichier ci-dessous pour le remplacer)</Text>
              </div>
            )}

            {!pdfFile ? (
              <Dragger {...draggerProps} className={styles.dragger}>
                <p className={styles.draggerIcon}>
                  <InboxOutlined />
                </p>
                <p className={styles.draggerText}>Cliquez ou glissez-déposez un fichier PDF ici</p>
                <p className={styles.draggerHint}>Fichier .pdf uniquement, {MAX_PDF_SIZE_MB} Mo maximum</p>
              </Dragger>
            ) : (
              <div className={styles.filePreview}>
                <FilePdfOutlined className={styles.filePreviewIcon} />
                <div className={styles.filePreviewInfo}>
                  <Text strong ellipsis className={styles.filePreviewName}>
                    {pdfFile.name}
                  </Text>
                  <Text type="secondary" className={styles.filePreviewSize}>
                    {formatFileSize(pdfFile.size)}
                  </Text>
                </div>
                {!isSaving && (
                  <button
                    type="button"
                    className={styles.filePreviewRemove}
                    onClick={() => setPdfFile(null)}
                    aria-label="Retirer le fichier"
                  >
                    <CloseCircleOutlined />
                  </button>
                )}
              </div>
            )}

            {isSaving && uploadProgress !== null && (
              <Progress percent={uploadProgress} size="small" style={{ marginTop: 12 }} />
            )}
          </Form.Item>

          <Form.Item label="Publier immédiatement">
            <Controller
              name="publie"
              control={control}
              render={({ field }) => <Switch checked={field.value} onChange={field.onChange} />}
            />
          </Form.Item>
        </Form>
      </FormDrawer>
    </div>
  )
}

export default ConseilsSante