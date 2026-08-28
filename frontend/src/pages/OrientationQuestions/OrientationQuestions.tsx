import { useState } from 'react'
import { Form, Input, InputNumber, Switch } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  DataTable,
  FormDrawer,
  PageHeader,
} from '@/components'

import { useConfirmDelete } from '@/hooks/useConfirmDelete'

import {
  useCreateOrientationQuestion,
  useDeleteOrientationQuestion,
  useOrientationQuestionsQuery,
  useUpdateOrientationQuestion,
} from '@/hooks/useOrientationQuestions'

import { getOrientationQuestionsColumns } from './columns'

import {
  orientationQuestionFormSchema,
  type OrientationQuestionFormValues,
} from './orientationQuestionFormSchema'

import type { OrientationQuestion } from '@/types'

const emptyValues: OrientationQuestionFormValues = {
  questionText: '',
  questionOrder: 1,
  active: true,
}

function OrientationQuestions() {
  const { data, isLoading } =
    useOrientationQuestionsQuery()

  const {
    mutate: createQuestion,
    isPending: isCreating,
  } = useCreateOrientationQuestion()

  const {
    mutate: updateQuestion,
    isPending: isUpdating,
  } = useUpdateOrientationQuestion()

  const {
    mutate: deleteQuestion,
  } = useDeleteOrientationQuestion()

  const confirmDelete = useConfirmDelete()

  const [drawerOpen, setDrawerOpen] =
    useState(false)

  const [editingQuestion, setEditingQuestion] =
    useState<OrientationQuestion | null>(null)

  const isEditMode =
    editingQuestion !== null

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OrientationQuestionFormValues>({
    resolver: zodResolver(
      orientationQuestionFormSchema,
    ),
    defaultValues: emptyValues,
  })

  const openCreateDrawer = () => {
    setEditingQuestion(null)
    reset(emptyValues)
    setDrawerOpen(true)
  }

  const openEditDrawer = (
    record: OrientationQuestion,
  ) => {
    setEditingQuestion(record)

    reset({
      questionText: record.questionText,
      questionOrder: record.questionOrder,
      active: record.active,
    })

    setDrawerOpen(true)
  }

  const closeDrawer = () => {
    setDrawerOpen(false)
    setEditingQuestion(null)
    reset(emptyValues)
  }

  const onSubmit = (
    values: OrientationQuestionFormValues,
  ) => {
    if (isEditMode && editingQuestion) {
      updateQuestion(
        {
          id: editingQuestion.id,
          payload: values,
        },
        {
          onSuccess: closeDrawer,
        },
      )

      return
    }

    createQuestion(values, {
      onSuccess: closeDrawer,
    })
  }

  const handleDelete = (
    record: OrientationQuestion,
  ) => {
    confirmDelete({
      title: 'Supprimer cette question ?',
      content: `"${record.questionText}"`,
      onConfirm: () =>
        deleteQuestion(record.id),
    })
  }

  const columns =
    getOrientationQuestionsColumns({
      onEdit: openEditDrawer,
      onDelete: handleDelete,
    })

  return (
    <div>
      <PageHeader
        title="Questions d’orientation"
        subtitle="Gérez les questions utilisées dans le système d’orientation médicale."
        actionLabel="Ajouter une question"
        onAction={openCreateDrawer}
      />

      <DataTable<OrientationQuestion>
        columns={columns}
        data={data ?? []}
        loading={isLoading}
        rowKey="id"
        searchableFields={['questionText']}
        searchPlaceholder="Rechercher une question..."
        emptyDescription="Aucune question d’orientation trouvée"
      />

      <FormDrawer
        title={
          isEditMode
            ? 'Modifier la question'
            : 'Ajouter une question'
        }
        open={drawerOpen}
        onClose={closeDrawer}
        onSubmit={handleSubmit(onSubmit)}
        loading={isCreating || isUpdating}
        submitLabel={
          isEditMode
            ? 'Enregistrer'
            : 'Créer'
        }
      >
        <Form layout="vertical">
          <Form.Item
            label="Question"
            validateStatus={
              errors.questionText
                ? 'error'
                : ''
            }
            help={
              errors.questionText?.message
            }
          >
            <Controller
              name="questionText"
              control={control}
              render={({ field }) => (
                <Input.TextArea
                  {...field}
                  rows={4}
                  placeholder="Saisissez la question..."
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Ordre"
            validateStatus={
              errors.questionOrder
                ? 'error'
                : ''
            }
            help={
              errors.questionOrder?.message
            }
          >
            <Controller
              name="questionOrder"
              control={control}
              render={({ field }) => (
                <InputNumber
                  min={1}
                  value={field.value}
                  onChange={(value) =>
                    field.onChange(
                      value ?? 1,
                    )
                  }
                  style={{
                    width: '100%',
                  }}
                />
              )}
            />
          </Form.Item>

          <Form.Item label="Statut actif">
            <Controller
              name="active"
              control={control}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onChange={
                    field.onChange
                  }
                />
              )}
            />
          </Form.Item>
        </Form>
      </FormDrawer>
    </div>
  )
}

export default OrientationQuestions