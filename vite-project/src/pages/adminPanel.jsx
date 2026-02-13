import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosClient from '../Utils/axiosClient';
import { useNavigate } from 'react-router';
import { Save, Plus, Trash2, Code, FileText, CheckCircle, Eye, EyeOff } from 'lucide-react';

// Zod schema matching the problem schema
const problemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  descripton: z.string().min(1, 'Description is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),

  tags: z.enum(['array', 'linkedList', 'graph', 'dp', 'math', 'queue', 'stack', 'tree', 'string', 'backtracking', 'slidingWindow', 'greedy', 'binarySearch', 'heap', 'bitManipulation'])
  ,
  visibleTestCase: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required'),
      explanation: z.string().min(1, 'Explanation is required')
    })
  ).min(1, 'At least one visible test case required'),
  hiddenTestCase: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required')
    })
  ).min(1, 'At least one hidden test case required'),

  startCode: z.array(
    z.object({
      language: z.enum(['c++', 'java', 'javascript']),
      intialCode: z.string().min(1, 'Initial code is required')
    })
  ).length(3, 'Java and JavaScript required'),
  refrenceSolution: z.array(
    z.object({
      language: z.enum(['c++', 'java', 'javascript']),
      completeCode: z.string().min(1, 'Complete code is required')
    })
  ).length(3, 'All three language are required')
});

function AdminPanel() {
  const navigate = useNavigate();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      startCode: [
        { language: 'c++', intialCode: '' },
        { language: 'java', intialCode: '' },
        { language: 'javascript', intialCode: '' }
      ],
      refrenceSolution: [
        { language: 'c++', completeCode: '' },
        { language: 'java', completeCode: '' },
        { language: 'javascript', completeCode: '' }
      ]
    }
  });

  const {
    fields: visibleFields,
    append: appendVisible,
    remove: removeVisible
  } = useFieldArray({
    control,
    name: 'visibleTestCase'
  });

  const {
    fields: hiddenFields,
    append: appendHidden,
    remove: removeHidden
  } = useFieldArray({
    control,
    name: 'hiddenTestCase'
  });

  const onSubmit = async (data) => {
    try {
      console.log(data);
      await axiosClient.post('/problem/create', data);
      alert('Problem created successfully!');
      navigate('/');
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto">

        <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-base-content">Create New Problem</h1>
            <p className="opacity-60 text-sm mt-1">Design a new challenge for the community</p>
          </div>
          <button className="btn btn-ghost" onClick={() => navigate('/admin')}>
            Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

          {/* Basic Information */}
          <div className="card bg-base-100 shadow-xl overflow-hidden border border-base-300">
            <div className="bg-base-200/50 p-4 border-b border-base-300 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-lg">Basic Information</h2>
            </div>

            <div className="card-body p-6 space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Problem Title</span>
                </label>
                <input
                  {...register('title')}
                  placeholder="e.g., Two Sum"
                  className={`input input-bordered focus:input-primary ${errors.title && 'input-error'}`}
                />
                {errors.title && (
                  <span className="text-error text-xs mt-1">{errors.title.message}</span>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Description (Markdown supported)</span>
                </label>
                <textarea
                  {...register('descripton')}
                  placeholder="Describe the problem, input/output formats, and constraints..."
                  className={`textarea textarea-bordered h-40 focus:textarea-primary font-mono text-sm leading-relaxed ${errors.descripton && 'textarea-error'}`}
                />
                {errors.descripton && (
                  <span className="text-error text-xs mt-1">{errors.descripton.message}</span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Difficulty Level</span>
                  </label>
                  <select
                    {...register('difficulty')}
                    className={`select select-bordered w-full focus:select-primary ${errors.difficulty && 'select-error'}`}
                  >
                    <option value="" disabled selected>Select Difficulty</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Topic Tag</span>
                  </label>
                  <select
                    {...register('tags')}
                    className={`select select-bordered w-full focus:select-primary ${errors.tags && 'select-error'}`}
                  >
                    <option value="" disabled selected>Select Tag</option>
                    <option value="array">Array</option>
                    <option value="linkedList">Linked List</option>
                    <option value="graph">Graph</option>
                    <option value="dp">DP</option>
                    <option value="math">Math</option>
                    <option value="queue">Queue</option>
                    <option value="stack">Stack</option>
                    <option value="tree">Tree</option>
                    <option value="string">String</option>
                    <option value="backtracking">Backtracking</option>
                    <option value="slidingWindow">Sliding Window</option>
                    <option value="greedy">Greedy</option>
                    <option value="binarySearch">Binary Search</option>
                    <option value="heap">Heap</option>
                    <option value="bitManipulation">Bit Manipulation</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Test Cases */}
          <div className="card bg-base-100 shadow-xl border border-base-300">
            <div className="bg-base-200/50 p-4 border-b border-base-300 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success" />
              <h2 className="font-bold text-lg">Test Cases</h2>
            </div>

            <div className="card-body p-6">

              {/* Visible Cases */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-sm uppercase tracking-wide opacity-70 flex items-center gap-2">
                    <Eye className="w-4 h-4" /> Visible Test Cases (Public)
                  </h3>
                  <button
                    type="button"
                    onClick={() => appendVisible({ input: '', output: '', explanation: '' })}
                    className="btn btn-sm btn-outline btn-primary"
                  >
                    <Plus className="w-4 h-4" /> Add Case
                  </button>
                </div>

                <div className="space-y-4">
                  {visibleFields.map((field, index) => (
                    <div key={field.id} className="relative collapse collapse-arrow bg-base-200 border border-base-300 rounded-lg">
                      <input type="checkbox" />
                      <div className="collapse-title font-medium flex items-center pr-12">
                        Case #{index + 1}
                      </div>
                      <div className="collapse-content space-y-3 pt-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="form-control">
                            <label className="label pb-1"><span className="label-text-alt">Input</span></label>
                            <input {...register(`visibleTestCase.${index}.input`)} placeholder="e.g. [2, 7, 11, 15], 9" className="input input-sm input-bordered font-mono" />
                          </div>
                          <div className="form-control">
                            <label className="label pb-1"><span className="label-text-alt">Output</span></label>
                            <input {...register(`visibleTestCase.${index}.output`)} placeholder="e.g. [0, 1]" className="input input-sm input-bordered font-mono" />
                          </div>
                        </div>
                        <div className="form-control">
                          <label className="label pb-1"><span className="label-text-alt">Explanation</span></label>
                          <textarea {...register(`visibleTestCase.${index}.explanation`)} className="textarea textarea-sm textarea-bordered h-20" placeholder="Explain why this output is correct..." />
                        </div>
                        <div className="flex justify-end pt-2">
                          <button type="button" onClick={() => removeVisible(index)} className="btn btn-xs btn-error btn-outline gap-1">
                            <Trash2 className="w-3 h-3" /> Remove Case
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {visibleFields.length === 0 && <p className="text-center italic opacity-50 py-4">No visible test cases added yet.</p>}
                </div>
              </div>

              <div className="divider"></div>

              {/* Hidden Cases */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-sm uppercase tracking-wide opacity-70 flex items-center gap-2">
                    <EyeOff className="w-4 h-4" /> Hidden Test Cases (Private)
                  </h3>
                  <button
                    type="button"
                    onClick={() => appendHidden({ input: '', output: '' })}
                    className="btn btn-sm btn-outline btn-secondary"
                  >
                    <Plus className="w-4 h-4" /> Add Case
                  </button>
                </div>

                <div className="space-y-4">
                  {hiddenFields.map((field, index) => (
                    <div key={field.id} className="p-4 bg-base-200/50 border border-base-300 rounded-xl relative group">
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button type="button" onClick={() => removeHidden(index)} className="btn btn-ghost btn-xs text-error">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-control">
                          <label className="label pb-1"><span className="label-text-alt">Input</span></label>
                          <input {...register(`hiddenTestCase.${index}.input`)} className="input input-sm input-bordered font-mono" />
                        </div>
                        <div className="form-control">
                          <label className="label pb-1"><span className="label-text-alt">Output</span></label>
                          <input {...register(`hiddenTestCase.${index}.output`)} className="input input-sm input-bordered font-mono" />
                        </div>
                      </div>
                    </div>
                  ))}
                  {hiddenFields.length === 0 && <p className="text-center italic opacity-50 py-4">No hidden test cases added yet.</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Code Templates */}
          <div className="card bg-base-100 shadow-xl border border-base-300">
            <div className="bg-base-200/50 p-4 border-b border-base-300 flex items-center gap-2">
              <Code className="w-5 h-5 text-accent" />
              <h2 className="font-bold text-lg">Code Boilerplate & Solutions</h2>
            </div>

            <div className="card-body p-6">
              <div className="tabs tabs-boxed mb-6 bg-base-200">
                <a className="tab tab-active">Language Configuration</a>
              </div>

              <div className="space-y-8">
                {[0, 1, 2].map((index) => (
                  <div key={index} className="collapse collapse-plus border border-base-300 bg-base-100 rounded-box">
                    <input type="checkbox" defaultChecked={index === 0} />
                    <div className="collapse-title text-xl font-medium flex items-center gap-2">
                      <span className="badge badge-lg badge-neutral">
                        {index === 0 ? 'C++' : index === 1 ? 'Java' : 'JavaScript'}
                      </span>
                    </div>
                    <div className="collapse-content">
                      <div className="pt-4 space-y-4">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-medium text-xs uppercase tracking-wider">Initial Starter Code</span>
                          </label>
                          <textarea
                            {...register(`startCode.${index}.intialCode`)}
                            className="textarea textarea-bordered w-full font-mono text-sm leading-relaxed h-32 bg-base-900 text-base-content"
                            placeholder="// User starts with this code..."
                          />
                        </div>

                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-medium text-xs uppercase tracking-wider text-success">Complete Solution Reference</span>
                          </label>
                          <textarea
                            {...register(`refrenceSolution.${index}.completeCode`)}
                            className="textarea textarea-bordered w-full font-mono text-sm leading-relaxed h-32 bg-base-900/50"
                            placeholder="// Complete working solution..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4 pb-12">
            <button type="submit" className="btn btn-primary flex-1 shadow-lg shadow-primary/20 text-lg">
              <Save className="w-5 h-5 mr-2" /> Publish Problem
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminPanel;
