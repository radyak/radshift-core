var chai = require('chai')
var expect = chai.expect

var ObjectUtil = require('../../src/util/ObjectUtil')

describe('ObjectUtil', function () {
  it('should traverse an object executing function', function () {
    var test = {
      'key1': 0,
      'key2': false,
      'key3': '',
      'key4': [
        0, false, '', [
          0, false, '', [0, { 'key5': 'val' }, false], { 'key6': 0, 'key7': { 'key8': 'val' }, 'key9': false }
        ],
        {
          'key10': 0,
          'key11': false,
          'key12': '',
          'key13': [0, { 'key14': 'val' }, false],
          'key15': { 'key16': 0, 'key17': { 'key18': 'val' }, 'key19': false }
        }
      ],
      'key20': {
        'key21': 0,
        'key22': false,
        'key23': '',
        'key24': [
          0, false, '', [0, { 'key25': 'val' }, false], { 'key26': 0, 'key27': { 'key28': 'val' }, 'key29': false }
        ],
        'key30': {
          'key31': 0,
          'key32': false,
          'key33': '',
          'key34': [0, { 'key35': 'val' }, false],
          'key36': { 'key37': 0, 'key38': { 'key39': 'val' }, 'key40': false }
        }
      }
    }

    var arr = []

    ObjectUtil.traverse(test, (key, val, owner) => {
      arr.push(`${key}=${val}`)
    })

    expect(arr.join(',')).to.equal('key1=0,key2=false,key3=,0=0,1=false,2=,0=0,1=false,2=,0=0,key5=val,2=false,key6=0,key8=val,key9=false,key10=0,key11=false,key12=,0=0,key14=val,2=false,key16=0,key18=val,key19=false,key21=0,key22=false,key23=,0=0,1=false,2=,0=0,key25=val,2=false,key26=0,key28=val,key29=false,key31=0,key32=false,key33=,0=0,key35=val,2=false,key37=0,key39=val,key40=false')
  })

  it('should copy an object', function () {
    var object = {
      'key1': 1,
      'key2': [1, 2, {
        'key1': 1,
        'key2': [1, 2, 3]
      }],
      'key3': {
        'key1': 1,
        'key2': [1, 2, {
          'key1': 1,
          'key2': [1, 2, 3]
        }],
        'key3': {
          'key1': 1,
          'key2': [1, 2, 3]
        }
      }
    }

    var copy = ObjectUtil.deepCopy(object)

    expect(copy).to.not.equal(object)
    expect(copy).to.deep.equal(object)
  })
})
